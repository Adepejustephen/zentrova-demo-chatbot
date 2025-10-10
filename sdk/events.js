// Shell interactions and page-specific bindings (match chatbot.html)
import { bindCallViewEvents } from './call.js';

// wireShellEvents(router)
export function wireShellEvents(router) {
  const toggleBtn = document.querySelector('.chatbot-toggler');
  const actions = document.querySelector('.chat-actions');
  const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;

  function updateTogglerIcon() {
    if (!toggleIcon) return;
    toggleIcon.className = actions.classList.contains('show') ? 'bi bi-x-lg' : 'bi bi-chat-dots';
  }

  toggleBtn && toggleBtn.addEventListener('click', () => {
    const isOpen = actions.classList.toggle('show');
    if (!isOpen) actions.classList.remove('show');
    updateTogglerIcon();
  });

  const pillToggle = document.getElementById('pill-toggle');
  pillToggle && pillToggle.addEventListener('click', () => {
    const prev = router.getPage();
    if (prev) localStorage.setItem('chatbot_prev_page', prev);
    document.body.classList.remove('show-chatbot');
    updateTogglerIcon();
  });

  const actionChat = document.getElementById('action-chat');
  const actionCall = document.getElementById('action-call');
  actionChat && actionChat.addEventListener('click', () => {
    actions.classList.remove('show');
    document.body.classList.add('show-chatbot');
    updateTogglerIcon();
    const storedPage = localStorage.getItem('chatbot_current_page');
    const hasUser = localStorage.getItem('chatbot_user_name');
    router.setPage(storedPage === 'chat' || hasUser ? 'chat' : 'welcome');
  });
  actionCall && actionCall.addEventListener('click', () => {
    actions.classList.remove('show');
    document.body.classList.add('show-chatbot');
    updateTogglerIcon();
    router.setPage('call-welcome');
  });
}

// addMessage and typing indicator
function addMessage(text, type) {
  const chatbox = document.querySelector('.chatbox');
  if (!chatbox) return;
  const li = document.createElement('li');
  if (type === 'typing') {
    li.className = 'chat typing';
    li.innerHTML = `<i class="bi bi-robot"></i><p class="typing"><span></span><span></span><span></span></p>`;
  } else {
    const variant = type === 'error' ? 'error' : type;
    li.className = `chat ${variant}`;
    if (variant === 'incoming') {
      li.innerHTML = `<i class="bi bi-robot"></i><div class="bubble">${renderMarkdown(text)}</div>`;
    } else if (variant === 'error') {
      li.innerHTML = `<i class="bi bi-robot"></i><p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`;
    } else {
      li.innerHTML = `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`;
    }
  }
  chatbox.appendChild(li);
  chatbox.scrollTop = chatbox.scrollHeight;
  return li;
}
function escapeHtml(str) {
  return (str || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

// Minimal safe Markdown → HTML renderer for bot replies
function renderMarkdown(md) {
  const esc = escapeHtml(md || '');
  const lines = esc.split('\n');
  let html = '';
  let inCode = false;
  let listType = null; // 'ul' | 'ol'

  function closeList() {
    if (listType) { html += `</${listType}>`; listType = null; }
  }
  function applyInline(t) {
    return t
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim().startsWith('```')) {
      if (!inCode) { closeList(); inCode = true; html += '<pre><code>'; } else { inCode = false; html += '</code></pre>'; }
      continue;
    }
    if (inCode) { html += line + '\n'; continue; }

    if (/^###\s+/.test(line)) { closeList(); html += '<h3>' + line.replace(/^###\s+/, '') + '</h3>'; continue; }
    if (/^##\s+/.test(line)) { closeList(); html += '<h2>' + line.replace(/^##\s+/, '') + '</h2>'; continue; }
    if (/^#\s+/.test(line))  { closeList(); html += '<h1>' + line.replace(/^#\s+/, '')  + '</h1>'; continue; }

    if (/^\s*\d+\.\s+/.test(line)) {
      const item = line.replace(/^\s*\d+\.\s+/, '');
      if (listType !== 'ol') { closeList(); listType = 'ol'; html += '<ol>'; }
      html += '<li>' + applyInline(item) + '</li>';
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const item = line.replace(/^\s*[-*]\s+/, '');
      if (listType !== 'ul') { closeList(); listType = 'ul'; html += '<ul>'; }
      html += '<li>' + applyInline(item) + '</li>';
      continue;
    }

    if (line.trim() === '') { closeList(); continue; }

    closeList();
    html += '<p>' + applyInline(line) + '</p>';
  }
  closeList();
  return html;
}

// Chat history helpers
function getHistoryKey(chatbotID) { return `chatbot_history_${chatbotID || 'default'}`; }
function loadHistory(chatbotID) { try { return JSON.parse(localStorage.getItem(getHistoryKey(chatbotID))) || []; } catch (_) { return []; } }
function saveHistory(chatbotID, history) { try { localStorage.setItem(getHistoryKey(chatbotID), JSON.stringify(history)); } catch (_) {} }
function renderHistory(history) { history.forEach((m) => addMessage(m.text, m.type)); }

const BASE_URL = 'https://zentrova-ai.mygrantgenie.com/api/v1';

// Bindings: bindViewEvents
export function bindViewEvents(router, ctx) {
  const page = router.getPage();
  const bot = ctx && ctx.bot;
  const chatbotID = ctx && ctx.chatbotID;
  const welcomeMsg = (bot && bot.welcome_message) || 'Hello! How can I help you today?';

  if (page === 'welcome') {
    const start = document.getElementById('start-conversation');
    start && start.addEventListener('click', () => router.setPage('prechat'));
    const footerChat = document.getElementById('footer-chat');
    footerChat && footerChat.addEventListener('click', () => router.setPage('prechat'));
    const footerCall = document.getElementById('footer-call');
    footerCall && footerCall.addEventListener('click', () => router.setPage('call-welcome'));
  } else if (page === 'call-welcome') {
    const back = document.getElementById('call-welcome-back');
    const start = document.getElementById('call-welcome-start');
    back && back.addEventListener('click', () => router.setPage('welcome'));
    start && start.addEventListener('click', () => router.setPage('precall'));
    const fc = document.getElementById('footer-call');
    const fch = document.getElementById('footer-chat');
    fc && fc.classList.add('active');
    fch && fch.classList.remove('active');
    fch && fch.addEventListener('click', () => router.setPage('prechat'));
  } else if (page === 'prechat') {
    // Store user info
    const form = document.getElementById('prechat-form');
    form && form.addEventListener('submit', () => {
      const name = (document.getElementById('prechat-name').value || '').trim();
      const email = (document.getElementById('prechat-email').value || '').trim();
      const code = document.getElementById('country-code').value || '';
      const phone = (document.getElementById('prechat-phone').value || '').trim();
      const question = (document.getElementById('prechat-question').value || '').trim();
      localStorage.setItem('chatbot_user_name', name);
      localStorage.setItem('chatbot_user_email', email);
      localStorage.setItem('chatbot_user_phone', `${code}${phone}`);
      localStorage.setItem('chatbot_user_question', question);
      router.setPage('chat');
    });
    const startBtn = document.getElementById('start-chat-btn');
    startBtn && startBtn.addEventListener('click', () => {
      const formEl = document.getElementById('prechat-form');
      formEl && formEl.dispatchEvent(new Event('submit'));
    });
    const preBack = document.getElementById('prechat-back-btn');
    preBack && preBack.addEventListener('click', () => router.setPage('welcome'));
    const footerChat = document.getElementById('footer-chat');
    const footerCall = document.getElementById('footer-call');
    footerChat && footerChat.addEventListener('click', () => router.setPage('prechat'));
    // Match html: prechat footer Call routes to 'call'
    footerCall && footerCall.addEventListener('click', () => router.setPage('call'));
    footerChat && footerChat.classList.add('active');
    footerCall && footerCall.classList.remove('active');
  } else if (page === 'chat') {
    const name = localStorage.getItem('chatbot_user_name') || 'Guest';
    const email = localStorage.getItem('chatbot_user_email') || '';
    const phone = localStorage.getItem('chatbot_user_phone') || '';
    const question = localStorage.getItem('chatbot_user_question') || '';

    // Load and render previous history; if none, show welcome
    let history = loadHistory(chatbotID);
    if (history.length > 0) {
      renderHistory(history);
    } else {
      addMessage(welcomeMsg, 'incoming');
    }

    const input = document.getElementById('chat-input');
    const send = document.getElementById('send-btn');
    const attach = document.getElementById('attach-btn');

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

    function persistMessage(text, type) {
      if (type === 'error') return; // do not store errors
      history.push({ text, type, ts: Date.now() });
      saveHistory(chatbotID, history);
    }

    async function sendToBot(userText) {
      // Outgoing message
      addMessage(userText, 'outgoing');
      persistMessage(userText, 'outgoing');
      const last = document.querySelector('.chatbox li:last-child');
      if (last && last.classList.contains('outgoing')) {
        const tag = document.createElement('span');
        tag.className = 'sender-tag';
        tag.textContent = name ? name : 'You';
        last.appendChild(tag);
      }

      // Typing indicator while awaiting reply
      const stopTyping = showTyping();

      const payload = {
        session_id: getSessionId(),
        message: userText,
        user_email: email,
        user_name: name,
        user_phone: phone
      };
      try {
        if (!chatbotID) throw new Error('Missing chatbotID');
        const res = await fetch(`${BASE_URL}/chatbots/widget/${encodeURIComponent(chatbotID)}/chat/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const ok = res.ok;
        const data = ok ? await res.json() : null;
        stopTyping();
        if (!ok) throw new Error('Request failed');
        const botReply = (data && data.bot_message && data.bot_message.message)
          || data?.data?.response
          || data?.response
          || data?.message
          || 'Okay.';
        addMessage(botReply, 'incoming');
        persistMessage(botReply, 'incoming');
      } catch (err) {
        stopTyping();
        const errMsg = 'Could not process your request at the moment. Please try again.';
        addMessage(errMsg, 'error');
        // removed persisting error: do not store error messages
      }
    }

    // Send the initial question only if there is no history yet
    if (question && history.length === 0) {
      sendToBot(question);
    }

    // Manual send handlers
    send && send.addEventListener('click', () => {
      const text = (input && input.value || '').trim();
      if (!text) return;
      input.value = '';
      sendToBot(text);
    });
    input && input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = (input && input.value || '').trim();
        if (!text) return;
        input.value = '';
        sendToBot(text);
      }
    });
    attach && attach.addEventListener('click', () => { /* TODO */ });

    const back = document.getElementById('chat-back-btn');
    back && back.addEventListener('click', () => router.setPage('prechat'));
  }
  // else if (page === 'call-welcome') {
  //   const back = document.getElementById('call-back');
  //   const end = document.getElementById('call-end');
  //   back && back.addEventListener('click', () => router.setPage('call-welcome'));
  //   end && end.addEventListener('click', () => router.setPage('call-welcome'));
  // }
  else if (page === 'call-welcome' || page === 'precall' || page === 'call') {
    // Delegate call pages to call module
    return bindCallViewEvents(router, ctx);
  } else if (page === 'prechat') {
    const form = document.getElementById('prechat-form');
    form && form.addEventListener('submit', () => {
      const name = (document.getElementById('prechat-name').value || '').trim();
      const email = (document.getElementById('prechat-email').value || '').trim();
      const code = document.getElementById('country-code').value || '';
      const phone = (document.getElementById('prechat-phone').value || '').trim();
      const question = (document.getElementById('prechat-question').value || '').trim();
      localStorage.setItem('chatbot_user_name', name);
      localStorage.setItem('chatbot_user_email', email);
      localStorage.setItem('chatbot_user_phone', `${code}${phone}`);
      localStorage.setItem('chatbot_user_question', question);
      router.setPage('chat');
    });
    const startBtn = document.getElementById('start-chat-btn');
    startBtn && startBtn.addEventListener('click', () => {
      const formEl = document.getElementById('prechat-form');
      formEl && formEl.dispatchEvent(new Event('submit'));
    });
    const preBack = document.getElementById('prechat-back-btn');
    preBack && preBack.addEventListener('click', () => router.setPage('welcome'));
    const footerChat = document.getElementById('footer-chat');
    const footerCall = document.getElementById('footer-call');
    footerChat && footerChat.addEventListener('click', () => router.setPage('prechat'));
    // Match html: prechat footer Call routes to 'call'
    footerCall && footerCall.addEventListener('click', () => router.setPage('call'));
    footerChat && footerChat.classList.add('active');
    footerCall && footerCall.classList.remove('active');
  } else if (page === 'chat') {
    const name = localStorage.getItem('chatbot_user_name') || 'Guest';
    const email = localStorage.getItem('chatbot_user_email') || '';
    const phone = localStorage.getItem('chatbot_user_phone') || '';
    const question = localStorage.getItem('chatbot_user_question') || '';

    // Load and render previous history; if none, show welcome
    let history = loadHistory(chatbotID);
    if (history.length > 0) {
      renderHistory(history);
    } else {
      addMessage(welcomeMsg, 'incoming');
    }

    const input = document.getElementById('chat-input');
    const send = document.getElementById('send-btn');
    const attach = document.getElementById('attach-btn');

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

    function persistMessage(text, type) {
      if (type === 'error') return; // do not store errors
      history.push({ text, type, ts: Date.now() });
      saveHistory(chatbotID, history);
    }

    async function sendToBot(userText) {
      // Outgoing message
      addMessage(userText, 'outgoing');
      persistMessage(userText, 'outgoing');
      const last = document.querySelector('.chatbox li:last-child');
      if (last && last.classList.contains('outgoing')) {
        const tag = document.createElement('span');
        tag.className = 'sender-tag';
        tag.textContent = name ? name : 'You';
        last.appendChild(tag);
      }

      // Typing indicator while awaiting reply
      const stopTyping = showTyping();

      const payload = {
        session_id: getSessionId(),
        message: userText,
        user_email: email,
        user_name: name,
        user_phone: phone
      };
      try {
        if (!chatbotID) throw new Error('Missing chatbotID');
        const res = await fetch(`${BASE_URL}/chatbots/widget/${encodeURIComponent(chatbotID)}/chat/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const ok = res.ok;
        const data = ok ? await res.json() : null;
        stopTyping();
        if (!ok) throw new Error('Request failed');
        const botReply = (data && data.bot_message && data.bot_message.message)
          || data?.data?.response
          || data?.response
          || data?.message
          || 'Okay.';
        addMessage(botReply, 'incoming');
        persistMessage(botReply, 'incoming');
      } catch (err) {
        stopTyping();
        const errMsg = 'Could not process your request at the moment. Please try again.';
        addMessage(errMsg, 'error');
        // removed persisting error: do not store error messages
      }
    }

    // Send the initial question only if there is no history yet
    if (question && history.length === 0) {
      sendToBot(question);
    }

    // Manual send handlers
    send && send.addEventListener('click', () => {
      const text = (input && input.value || '').trim();
      if (!text) return;
      input.value = '';
      sendToBot(text);
    });
    input && input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = (input && input.value || '').trim();
        if (!text) return;
        input.value = '';
        sendToBot(text);
      }
    });
    attach && attach.addEventListener('click', () => { /* TODO */ });

    const back = document.getElementById('chat-back-btn');
    back && back.addEventListener('click', () => router.setPage('prechat'));
  } else if (page === 'call-welcome') {
    const back = document.getElementById('call-back');
    const end = document.getElementById('call-end');
    back && back.addEventListener('click', () => router.setPage('call-welcome'));
    end && end.addEventListener('click', () => router.setPage('call-welcome'));
  }
}

function showTyping() {
  const el = addMessage('', 'typing');
  return function stopTyping() {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  };
}

// Inject and update call status bar on call screen
// updateCallStatus(): disable status bar rendering
function updateCallStatus(status, detail) {
// No status UI; keep behavior minimal
return;
}

// Remove status-driven End button disable/spinner
window.addEventListener('chatbot-call-status', (ev) => {
// No-op; status UI removed
});
window.addEventListener('chatbot-call-status', (ev) => {
  const status = ev?.detail?.status || '';
  const endBtn = document.getElementById('call-end');
  const isConnecting = status === 'connecting';
  if (endBtn) {
    endBtn.classList.toggle('loading', isConnecting);
    endBtn.disabled = isConnecting;
  }
});

