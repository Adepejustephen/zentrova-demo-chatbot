// Call module: handle call-welcome, precall, and live call lifecycle
const BASE_URL = 'https://zentrova-ai.mygrantgenie.com/api/v1';

let callWS = null;
let callAudioContext = null;
let callAudioSource = null;
let callAudioProcessor = null;
let callEndInterval = null;
let micActive = false;
let callInitInProgress = false;
// NEW: termination + current playback handle
let callTerminated = false;
let currentPlaybackSource = null;

function cleanupCall() {
  try {
    callTerminated = true;
    // stop mic capture & processor
    if (callAudioProcessor) { callAudioProcessor.disconnect(); callAudioProcessor = null; }
    if (callAudioSource) {
      callAudioSource.disconnect();
      if (callAudioSource.mediaStream) callAudioSource.mediaStream.getTracks().forEach(t => t.stop());
      callAudioSource = null;
    }
    // stop any currently playing buffer
    try { if (currentPlaybackSource) { currentPlaybackSource.stop(); currentPlaybackSource.disconnect(); } } catch (_) {}
    currentPlaybackSource = null;
    // clear playback queue and timing
    audioQueue = [];
    isPlayingAudio = false;
    nextPlayTime = 0;
    // close audio context
    if (callAudioContext) { try { callAudioContext.close(); } catch(_){} callAudioContext = null; }
    // close websocket
    if (callWS) { try { if (callWS.readyState === WebSocket.OPEN) callWS.close(1000, 'User ended call'); } catch(_){} callWS = null; }
    if (callEndInterval) { clearInterval(callEndInterval); callEndInterval = null; }
    micActive = false;
    callInitInProgress = false; // guard reset
  } catch (_) {}
}

function getSessionId() {
  let sid = localStorage.getItem('chatbot_session_id');
  if (!sid) {
    sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8; return v.toString(16);
    });
    localStorage.setItem('chatbot_session_id', sid);
  }
  return sid;
}

// NEW: status dispatcher
function dispatchCallStatus(status, extra = {}) {
  try {
    window.dispatchEvent(new CustomEvent('chatbot-call-status', { detail: { status, ...extra } }));
  } catch (_) {}
}

// NEW: normalize ws url and extract optional protocols
function normalizeWSUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol === 'https:') u.protocol = 'wss:';
    if (u.protocol === 'http:') u.protocol = 'ws:';
    return u.toString();
  } catch (_) {
    return (url || '').replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');
  }
}
function extractWSProtocols(configurePayload) {
  const p = configurePayload && configurePayload.protocols;
  if (!p) return undefined;
  if (Array.isArray(p) && p.length) return p;
  if (typeof p === 'string' && p.trim()) return [p.trim()];
  return undefined;
}

// startAudioCapture + helpers
function startAudioCapture() {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: 24000,
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  }).then(stream => {
    callAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    callAudioSource = callAudioContext.createMediaStreamSource(stream);
    callAudioProcessor = callAudioContext.createScriptProcessor(4096, 1, 1);

    callAudioProcessor.onaudioprocess = (e) => {
      if (!callWS || callWS.readyState !== WebSocket.OPEN) return;
      const float32Data = e.inputBuffer.getChannelData(0);
      const pcm16Data = new Int16Array(float32Data.length);
      for (let i = 0; i < float32Data.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Data[i]));
        pcm16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      const uint8 = new Uint8Array(pcm16Data.buffer);
      const b64 = btoa(String.fromCharCode.apply(null, uint8));
      callWS.send(JSON.stringify({ type: 'audio_chunk', audio_data: b64, format: 'pcm16' }));
    };

    callAudioSource.connect(callAudioProcessor);
    callAudioProcessor.connect(callAudioContext.destination);

    callEndInterval = setInterval(() => {
      if (callWS && callWS.readyState === WebSocket.OPEN) {
        callWS.send(JSON.stringify({ type: 'end_audio', format: 'pcm16' }));
      }
    }, 5000);

    micActive = true;
    dispatchCallStatus('mic_granted');
  });
}

function stopAudioCapture() {
  try {
    if (callAudioProcessor) { callAudioProcessor.disconnect(); callAudioProcessor = null; }
    if (callAudioSource) {
      callAudioSource.disconnect();
      if (callAudioSource.mediaStream) callAudioSource.mediaStream.getTracks().forEach(t => t.stop());
      callAudioSource = null;
    }
    if (callEndInterval) { clearInterval(callEndInterval); callEndInterval = null; }
    micActive = false;
    dispatchCallStatus('closed');
  } catch (_) {}
}

function resumeAudioCapture() {
  startAudioCapture().catch(err => dispatchCallStatus('mic_error', { error: err?.message || 'Microphone error' }));
}

// NEW: playback queue for AI audio
let audioQueue = [];
let isPlayingAudio = false;
let nextPlayTime = 0;

// NEW: playback helpers (base64 PCM16 -> Float32 -> AudioBuffer -> queued playback)
function playAudioChunk(base64Audio) {
  try {
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

    if (!callAudioContext) {
      callAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }

    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) float32Array[i] = int16Array[i] / 32768.0;

    const buffer = callAudioContext.createBuffer(1, float32Array.length, 24000);
    buffer.getChannelData(0).set(float32Array);

    audioQueue.push(buffer);
    if (!isPlayingAudio) playNextInQueue();
  } catch (err) {
    console.error('Audio decode/play error:', err);
  }
}

function playNextInQueue() {
  if (!audioQueue.length || !callAudioContext || callTerminated) { isPlayingAudio = false; return; }
  isPlayingAudio = true;
  const buffer = audioQueue.shift();
  try {
    const source = callAudioContext.createBufferSource();
    currentPlaybackSource = source; // NEW: track to stop on cleanup
    source.buffer = buffer;
    source.connect(callAudioContext.destination);
    const currentTime = callAudioContext.currentTime;
    const startTime = Math.max(currentTime, nextPlayTime);
    source.start(startTime);
    nextPlayTime = startTime + buffer.duration;
    source.onended = () => { currentPlaybackSource = null; playNextInQueue(); };
  } catch (err) {
    console.error('Audio playback error:', err);
    currentPlaybackSource = null;
    playNextInQueue();
  }
}

function connectCallWebSocket(wsUrl, configurePayload, attempt = 0) {
  const MAX_RETRIES = 3;
  const RETRY_MS = 1000 * Math.min(4, attempt + 1);
  let opened = false;

  cleanupCall();
  callTerminated = false; // NEW: allow new session
  try {
    const normalized = normalizeWSUrl(wsUrl);
    const protocols = extractWSProtocols(configurePayload);
    dispatchCallStatus('connecting', { wsUrl: normalized });
    callWS = protocols ? new WebSocket(normalized, protocols) : new WebSocket(normalized);
  } catch (e) {
    console.error('WS construct error:', e);
    dispatchCallStatus('error', { error: e?.message || 'WebSocket construct error' });
    if (attempt < MAX_RETRIES) setTimeout(() => connectCallWebSocket(wsUrl, configurePayload, attempt + 1), RETRY_MS);
    return;
  }

  callWS.onopen = () => {
    opened = true;
    dispatchCallStatus('connected');
    const cfg = { type: 'configure', ...(configurePayload || {}) };
    try { callWS.send(JSON.stringify(cfg)); } catch (e) { console.error('WS send configure error:', e); }
  };

  callWS.onmessage = async (event) => {
    if (callTerminated) return; // NEW: ignore after end
    const msg = JSON.parse(event.data);
    const type = msg.type;
    if (type === 'configured') {
      dispatchCallStatus('configured');
      try { await startAudioCapture(); } catch (err) {
        console.error('Mic error:', err);
        dispatchCallStatus('mic_error', { error: err?.message || 'Microphone error' });
      }
    } else if (type === 'audio_response_chunk') {
      const indicator = document.getElementById('call-audio-indicator');
      indicator && indicator.classList.add('active');
      const circle = document.getElementById('call-circle');
      circle && circle.classList.add('responding');
      playAudioChunk(msg.audio_data);
    } else if (type === 'audio_response_complete') {
      const indicator = document.getElementById('call-audio-indicator');
      indicator && indicator.classList.remove('active');
      const circle = document.getElementById('call-circle');
      circle && circle.classList.remove('responding');
      if (audioQueue.length === 0) nextPlayTime = 0;
    } else if (type === 'rag_context_applied' || type === 'text_sent') {
      console.log('Call info:', msg);
    } else if (type === 'error') {
      console.error('Call error:', msg.error);
      dispatchCallStatus('error', { error: msg.error });
    } else {
      console.log('WS message:', msg);
    }
  };

  callWS.onerror = (e) => {
    console.error('WS error', e);
    dispatchCallStatus('error', { error: 'WebSocket error' });
  };

  callWS.onclose = (ev) => {
    console.warn('WS close', { code: ev.code, reason: ev.reason });
    cleanupCall();
    dispatchCallStatus('closed', { code: ev.code, reason: ev.reason });
    if ((!opened || ev.code === 1006 || ev.code === 1005) && attempt < MAX_RETRIES && !callTerminated) {
      setTimeout(() => connectCallWebSocket(wsUrl, configurePayload, attempt + 1), RETRY_MS);
    }
  };
}

export function bindCallViewEvents(router, ctx) {
  const page = router.getPage();

  if (page === 'call-welcome') {
    const back = document.getElementById('call-welcome-back');
    const start = document.getElementById('call-welcome-start');
    back && back.addEventListener('click', () => router.setPage('welcome'));
    start && start.addEventListener('click', () => router.setPage('precall'));
    const fc = document.getElementById('footer-call');
    const fch = document.getElementById('footer-chat');
    fc && fc.classList.add('active');
    fch && fch.classList.remove('active');
    fch && fch.addEventListener('click', () => router.setPage('prechat'));
    return;
  }

  if (page === 'precall') {
    const form = document.getElementById('precall-form');
    const startBtn = document.getElementById('precall-start');
    const backBtn = document.getElementById('precall-back');

    function setPrecallBusy(busy) {
      if (startBtn) startBtn.disabled = !!busy;
      const card = document.querySelector('.precall-card');
      if (card) card.style.pointerEvents = busy ? 'none' : 'auto';
      if (card) card.style.opacity = busy ? '0.6' : '1';
    }

    async function initCall() {
      if (callInitInProgress) return; // guard double-submit
      callInitInProgress = true;
      setPrecallBusy(true);

      const name = (document.getElementById('precall-name').value || '').trim();
      const email = (document.getElementById('precall-email').value || '').trim();
      const code = document.getElementById('precall-country').value || '';
      const phone = (document.getElementById('precall-phone').value || '').trim();
      const message = localStorage.getItem('chatbot_user_question') || "Start call";

      localStorage.setItem('chatbot_user_name', name);
      localStorage.setItem('chatbot_user_email', email);
      localStorage.setItem('chatbot_user_phone', `${code}${phone}`);

      const chatbotID = ctx && ctx.chatbotID;
      if (!chatbotID) { console.error('Missing chatbotID'); callInitInProgress = false; setPrecallBusy(false); return; }

      const payload = {
        session_id: getSessionId(),
        message,
        user_phone: `${code}${phone}`,
        user_name: name
      };

      try {
        const res = await fetch(`${BASE_URL}/chatbots/widget/${encodeURIComponent(chatbotID)}/call/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Call init failed');
        const data = await res.json();
        const info = data && data.connection_info;
        if (!info || !info.websocket_url) throw new Error('Missing WebSocket URL');

        // Ensure POST finished before attempting websocket; optional short delay to allow provisioning
        const wsUrl = normalizeWSUrl(info.websocket_url);
        const cfg = info.configure_payload || {};
        await new Promise(r => setTimeout(r, 200));
        connectCallWebSocket(wsUrl, cfg);

        router.setPage('call');
      } catch (err) {
        console.error('Init call error:', err);
        dispatchCallStatus('error', { error: err?.message || 'Initialization failed' });
        alert('Unable to start call. Please try again.');
      } finally {
        callInitInProgress = false;
        setPrecallBusy(false);
      }
    }

    // Keep form submit (for Enter key) and call initializer
    form && form.addEventListener('submit', (e) => { e.preventDefault(); initCall(); });

    // Ensure Start button triggers init directly (no synthetic submit)
    startBtn && startBtn.addEventListener('click', (e) => { e.preventDefault(); initCall(); });

    backBtn && backBtn.addEventListener('click', () => router.setPage('call-welcome'));
    return;
  }

  if (page === 'call') {
    const back = document.getElementById('call-back');
    const end = document.getElementById('call-end');
    const circle = document.getElementById('call-circle');

    back && back.addEventListener('click', () => { callTerminated = true; cleanupCall(); router.setPage('call-welcome'); });
    end && end.addEventListener('click', () => { callTerminated = true; cleanupCall(); router.setPage('call-welcome'); });

    // Removed toggle recording functionality
    // (No mic toggle; streaming controlled by system and End button)

    return;
  }
}