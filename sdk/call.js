// Call module: handle call-welcome, precall, and live call lifecycle
// Module globals
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
let pc = null;
let dataChannel = null;
let localStream = null;
let playbackAudioContext = null;
let playbackAnalyser = null;
let playbackSourceNode = null;
let playbackMonitorRAF = null;
// cleanupCall()
// cleanupCall(): stop touching wave indicator since it was removed
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
    // NEW: close WebRTC resources
    try {
      if (dataChannel) { try { dataChannel.close(); } catch(_){} dataChannel = null; }
      if (pc) { try { pc.close(); } catch(_){} pc = null; }
      if (localStream) { try { localStream.getTracks().forEach(t => t.stop()); } catch(_){} localStream = null; }
      const assistantAudio = document.getElementById('assistantAudio');
      if (assistantAudio) assistantAudio.srcObject = null;
      // NEW: stop playback monitor
      if (playbackMonitorRAF) { cancelAnimationFrame(playbackMonitorRAF); playbackMonitorRAF = null; }
      try { if (playbackAnalyser) playbackAnalyser.disconnect(); } catch(_) {}
      playbackAnalyser = null;
      try { if (playbackSourceNode) playbackSourceNode.disconnect(); } catch(_) {}
      playbackSourceNode = null;
      if (playbackAudioContext) { try { playbackAudioContext.close(); } catch(_) {} playbackAudioContext = null; }
    } catch (_) {}
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
      const circle = document.getElementById('call-circle');
      circle && circle.classList.add('responding');
      playAudioChunk(msg.audio_data);
    } else if (type === 'audio_response_complete') {
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
  const conversationId = localStorage.getItem('chatbot_conversation_id');

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
      if (callInitInProgress) return;
      callInitInProgress = true;
      setPrecallBusy(true);

      const name = (document.getElementById('precall-name').value || '').trim();
     
      const code = document.getElementById('precall-country').value || '';
      const phone = (document.getElementById('precall-phone').value || '').trim();
      const message = localStorage.getItem('chatbot_user_question') || 'Start call';

      try {
        localStorage.setItem('chatbot_user_name', name);
        localStorage.setItem('chatbot_user_phone', `${code}${phone}`);
        localStorage.setItem('chatbot_user_question', message);
      } catch (_) {}

      const chatbotID = (ctx && ctx.chatbotID) || localStorage.getItem('chatbot_id');
      if (!chatbotID) { console.error('Missing chatbotID'); callInitInProgress = false; setPrecallBusy(false); return; }

      try {
        // Align with react.tsx: start call and store call_id
        const res = await fetch(`${BASE_URL}/chatbots/call/${encodeURIComponent(chatbotID)}/start/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            user_phone: `${code}${phone}`,
            user_name: name
          })
        });
        if (!res.ok) throw new Error('Call init failed');
        const data = await res.json();

        // Store conversation id for end/complete
        try {
          const convId = data && (data.call_id || data.conversation_id || data.id);
          if (convId) localStorage.setItem('chatbot_conversation_id', String(convId));
        } catch (_) {}

        // Prepare config for RTC (prefer localStorage values set by chatbot-sdk)
        const bot = ctx && ctx.bot;
        const agentId = chatbotID;
        const language = (bot && bot.language) || localStorage.getItem('chatbot_bot_language') || 'English';
        const voice = (bot && bot.voice) || localStorage.getItem('chatbot_bot_voice') || 'alloy';
        const welcomeMessage = (bot && bot.welcome_message) || localStorage.getItem('chatbot_bot_welcome_message') || 'Hello! How can I assist you today?';

        await new Promise(r => setTimeout(r, 200)); // small delay
        startRTCSession({ agentId, language, voice, welcomeMessage });

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

    form && form.addEventListener('submit', (e) => { e.preventDefault(); initCall(); });
    startBtn && startBtn.addEventListener('click', (e) => { e.preventDefault(); initCall(); });
    backBtn && backBtn.addEventListener('click', () => router.setPage('call-welcome'));
    return;
  }

  if (page === 'call') {
    const back = document.getElementById('call-back');
    const end = document.getElementById('call-end');

    async function endAndClose() {
      try {
        const convId = localStorage.getItem('chatbot_conversation_id');
        if (convId) {
          await fetch(`${BASE_URL}/chatbots/call/${encodeURIComponent(convId)}/complete/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          try { localStorage.removeItem('chatbot_conversation_id'); } catch (_) {}
        } else {
          const sid = getSessionId();
          await fetch(`${BASE_URL}/chatbots/conversations/${encodeURIComponent(sid)}/end/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (_) { }
      callTerminated = true;
      cleanupCall();
      router.setPage('call-welcome');
    }

    back && back.addEventListener('click', (e) => { e.preventDefault(); endAndClose(); });
    end && end.addEventListener('click', (e) => { e.preventDefault(); endAndClose(); });
    return;
  }

 
}

// NEW: WebRTC ephemeral token fetch (same approach as new-chat.html)
async function fetchEphemeralToken(agentId, language, voice, welcomeMessage) {
  const tokenUrl = 'https://zentrova-chatbot.mygrantgenie.com/realtime/token';

  let customApis = null;
  try {
    const raw = localStorage.getItem('chatbot_custom_apis');
    const parsed = raw ? JSON.parse(raw) : null;
    customApis = Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch (_) {
    customApis = null;
  }

  const body = {};
  if (agentId) body.agent_id = agentId;
  if (voice) body.voice = voice;
  if (language) body.language = language;
  if (welcomeMessage) body.welcome_message = welcomeMessage;
  if (customApis) body.custom_apis = customApis;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain token: ${errorText}`);
  }
  const payload = await response.json();
  if (!payload.value) {
    throw new Error('Token response missing value field');
  }
  return payload.value;
}

// NEW: handle function calls over RTC data channel (optional RAG search)
async function handleFunctionCall(functionName, functionCallId, args) {
  try {
    const parsedArgs = JSON.parse(args || '{}');
    const response = await fetch('https://zentrova-chatbot.mygrantgenie.com/realtime/function-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ function_name: functionName, arguments: parsedArgs })
    });
    if (!response.ok) throw new Error(`Function call failed: ${response.statusText}`);
    const result = await response.json();

    if (dataChannel && dataChannel.readyState === 'open') {
      const outputEvent = {
        type: 'conversation.item.create',
        item: { type: 'function_call_output', call_id: functionCallId, output: JSON.stringify(result) }
      };
      dataChannel.send(JSON.stringify(outputEvent));
      dataChannel.send(JSON.stringify({ type: 'response.create' }));
    }
  } catch (error) {
    if (dataChannel && dataChannel.readyState === 'open') {
      const outputEvent = {
        type: 'conversation.item.create',
        item: { type: 'function_call_output', call_id: functionCallId, output: JSON.stringify({ error: error?.message || 'Function call error' }) }
      };
      dataChannel.send(JSON.stringify(outputEvent));
    }
  }
}

// NEW: WebRTC session (mirrors new-chat.html, integrated with call UI)
async function startRTCSession({ agentId, language, voice, welcomeMessage }) {
  try {
    dispatchCallStatus('connecting');

    // NEW: fallback to stored config (set by chatbot-sdk on load)
    const storedAgentId = localStorage.getItem('chatbot_id') || agentId;
    const storedVoice = localStorage.getItem('chatbot_bot_voice') || voice;
    const storedLanguage = localStorage.getItem('chatbot_bot_language') || language;
    const storedWelcome = localStorage.getItem('chatbot_bot_welcome_message') || welcomeMessage;

    const ephemeralKey = await fetchEphemeralToken(storedAgentId, storedLanguage, storedVoice, storedWelcome);

    pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    pc.ontrack = (event) => {
      const assistantAudio = document.getElementById('assistantAudio');
      if (assistantAudio) {
        assistantAudio.srcObject = event.streams[0];
        assistantAudio.play().catch(() => {});
      }
      startPlaybackMonitor(event.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'connected') {
        dispatchCallStatus('connected');
      } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        dispatchCallStatus('error', { error: 'Connection lost' });
        cleanupCall();
      }
    };

    // Mic capture for RTC
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    dispatchCallStatus('mic_granted');

    // Data channel (events)
    dataChannel = pc.createDataChannel('oai-events');
    dataChannel.onopen = () => {
      dispatchCallStatus('configured');
      dataChannel.send(JSON.stringify({ type: 'response.create' }));
    };

    dataChannel.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const circle = document.getElementById('call-circle');
        if (payload.type === 'response.audio.delta') {
          circle && circle.classList.add('responding');
        } else if (payload.type === 'response.audio.done') {
          circle && circle.classList.remove('responding');
        } else if (payload.type === 'response.function_call_arguments.done') {
          handleFunctionCall(payload.name, payload.call_id, payload.arguments);
        } else if (payload.type === 'response.done') {
          dispatchCallStatus('connected');
        }
      } catch (_) {
        // Non-JSON
      }
    };

    dataChannel.onerror = (error) => {
      dispatchCallStatus('error', { error: 'Data channel error' });
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const sdpResponse = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ephemeralKey}`, 'Content-Type': 'application/sdp' },
      body: offer.sdp,
    });
    if (!sdpResponse.ok) {
      const errText = await sdpResponse.text();
      throw new Error(`OpenAI SDP error ${sdpResponse.status}: ${errText}`);
    }
    const answer = await sdpResponse.text();
    await pc.setRemoteDescription({ type: 'answer', sdp: answer });
  } catch (error) {
    dispatchCallStatus('error', { error: error.message });
    cleanupCall();
  }
}

// Helper: monitor assistant audio levels and toggle circle animation
function startPlaybackMonitor(stream) {
  const circle = document.getElementById('call-circle');
  if (!circle || !stream) return;
  try {
    if (playbackMonitorRAF) { cancelAnimationFrame(playbackMonitorRAF); playbackMonitorRAF = null; }
    if (playbackAudioContext) { try { playbackAudioContext.close(); } catch(_){} playbackAudioContext = null; }

    playbackAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    playbackSourceNode = playbackAudioContext.createMediaStreamSource(stream);
    playbackAnalyser = playbackAudioContext.createAnalyser();
    playbackAnalyser.fftSize = 2048;
    playbackSourceNode.connect(playbackAnalyser);

    const data = new Uint8Array(playbackAnalyser.frequencyBinCount);
    function tick() {
      try {
        playbackAnalyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.02) circle.classList.add('responding'); else circle.classList.remove('responding');
      } catch (_) {}
      playbackMonitorRAF = requestAnimationFrame(tick);
    }
    tick();
  } catch (_) {}
}
