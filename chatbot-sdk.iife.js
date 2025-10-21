var ChatbotSDK = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // chatbot-sdk.js
  var chatbot_sdk_exports = {};
  __export(chatbot_sdk_exports, {
    ChatbotSDK: () => ChatbotSDK,
    init: () => init
  });

  // sdk/styles.js
  function importStyleLink(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  function importFonts() {
    importStyleLink("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css");
    importStyleLink("https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap");
  }
  function injectStyles() {
    const css = `
    :root { --brand: #5b2a86; --bg: #ffffff; --text: #1f2937; --muted: #6b7280; --bot-bg: #eef2f7; --user-bg: #eef2ff; --radius: 12px; --radius-lg: 18px; --s-1: 8px; --s-2: 12px; --s-3: 16px; --shadow-1: 0 8px 24px rgba(0, 0, 0, 0.08); --shadow-2: 0 10px 24px rgba(0, 0, 0, 0.12); }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
    .chatbot-toggler { position: fixed; right: 24px; bottom: 30px; height: 56px; width: 56px; border-radius: 50%; border: none; outline: none; cursor: pointer; background: var(--brand); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-2); z-index: 999; transition: transform 0.25s ease; }
    .chatbot-toggler i { font-size: 1.25rem; }
    .chat-actions { position: fixed; right: 24px; bottom: 100px; display: none; flex-direction: column; gap: 12px; z-index: 999; filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12)); }
    .chat-actions.show { display: flex; }
    .show-chatbot .chat-actions { display: none !important; }
    .show-chatbot .chatbot-toggler { display: none; }
    .icon-btn { background: transparent; border: none; color: #fff; font-size: 20px; padding: 4px 8px; cursor: pointer; }
    .powered-pill { position: fixed; right: 24px; bottom: 30px; display: none; align-items: center; gap: 8px; background: #fff; color: #111; border-radius: 999px; box-shadow: var(--shadow-1); padding: 6px 10px; z-index: 999; }
    .powered-pill .brand { font-weight: 700; color: var(--brand); font-size: 0.725rem; }
    .powered-pill span { font-weight: 500; font-size: 0.725rem; }
    .powered-pill .pill-btn { background: var(--brand); color: #fff; border: none; padding: 6px 10px; border-radius: 32px; cursor: pointer; font-size: 12px; }
    .powered-pill .pill-toggle { background: var(--brand); color: #fff; width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .show-chatbot .powered-pill { display: flex; }
    .chat-action { background: var(--brand); color: #fff; border-radius: 12px; padding: 12px 16px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; }
    .chatbot { width: 420px; position: fixed; right: 24px; bottom: 100px; background: var(--bg); border-radius: var(--radius-lg); box-shadow: var(--shadow-2); overflow: hidden; transform: scale(0.5); opacity: 0; pointer-events: none; transition: all 0.25s ease; z-index: 999; }
    .show-chatbot .chatbot { transform: scale(1); opacity: 1; pointer-events: auto; }
    header.chatbot-header { padding: var(--s-3); background: var(--brand); color: #fff; position: relative; }
    header.chatbot-header h2 { font-size: 18px; font-weight: 700; }
    header.chatbot-header span { position: absolute; top: 12px; right: 16px; font-size: 11px; font-weight: 600; opacity: 0.9; }
    #chatbot-content { min-height: 400px; background: #f8fafc; position: relative; }
    /* Agent status banner */
    .agent-status { position: absolute; top: 8px; left: 8px; right: 8px; padding: 8px 12px; border-radius: 12px; font-size: 14px; line-height: 1.4; display: none; z-index: 5; }
    .agent-status.show { display: block; }
    .agent-status.info { background: #eef2ff; color: #1e3a8a; border: 1px solid #c7d2fe; }
    .agent-status.error { background: #fee2e2; color: #7f1d1d; border: 1px solid #fca5a5; }
    .welcome-screen { background: linear-gradient(180deg, var(--brand) 0%, #3a1b5a 100%); border-radius: var(--radius-lg); min-height: 420px; display: flex; flex-direction: column; gap: 16px; }
    .call-welcome { background: white; border-radius: var(--radius-lg); min-height: 400px; display: flex; flex-direction: column; gap: 16px; }
    .call-welcome-card { flex: 1; display:flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; }
    
    /* Missing styles for Call buttons used in views.js */
    .call-primary { background: var(--brand); color: #fff; border: none; border-radius: 999px; padding: 10px 24px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow-1); font-size: 0.875rem; }
    .call-primary:active { transform: scale(0.98); }
    .welcome-header { color: #fff; margin-bottom: 32px; }
    .welcome-main { padding: var(--s-3); }
    .welcome-header h2 { color: #fff; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .welcome-header p { color: #d6cce8; font-size: 0.835rem; max-width: 70%; }
    .start-conversation-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; background: #fff; color: var(--text); border: none; border-radius: 18px; padding: 16px 18px; box-shadow: var(--shadow-1); cursor: pointer; }
    .start-conversation-btn .title { font-weight: 700; font-size: 16px; }
    .start-conversation-btn .subtitle { font-size: 12px; color: var(--muted); margin-top: 4px; }
    .start-conversation-btn .cta-arrow { color: var(--brand); font-size: 24px; }
    .welcome-footer { background: #fff; border-top: 1px solid #e5e7eb; padding: 14px 32px; border-radius: 0 0 var(--radius-lg) var(--radius-lg); display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
    .welcome-footer .footer-action { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #6b7280; font-weight: 500; background: transparent; border: none; cursor: pointer; font-size: 0.875rem; }
    .welcome-footer .footer-action i { font-size: 18px; color: #6b7280; }
    .prechat-main { padding: var(--s-3); }
    .prechat-intro { color: #d6cce8; font-size: 0.875rem; max-width: 80%; margin: 8px 0 12px; }
    .prechat-card, .precall-card { background: #fff; border-radius: 18px; padding: var(--s-3); box-shadow: var(--shadow-1); color: var(--text); }
    .prechat-start-btn { display: flex; align-items: center; gap: 8px; background: var(--brand); color: #fff; border: none; border-radius: 999px; padding: 10px 14px; font-weight: 700; cursor: pointer; width: max-content; font-size: 0.875rem; }
    .prechat-start-btn i { font-size: 14px; }
    .prechat-start-btn span { font-size: 0.875rem; }
    .welcome-footer .footer-action.active { color: var(--brand); }
    .welcome-footer .footer-action.active i { color: var(--brand); }
    .prechat-form { display: flex; flex-direction: column; gap: 10px; padding: var(--s-1); }
    .prechat-form label { font-size: 12px; color: var(--muted); }
    .prechat-form input, .prechat-form select, .prechat-form textarea { padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 14px; outline: none; background: #fff; }
    .country-row { display: grid; grid-template-columns: 90px 1fr; gap: 8px; }
    .btn-primary { background: var(--brand); color: #fff; border: none; border-radius: 10px; padding: 12px; cursor: pointer; font-weight: 700; }
    .chat-header { display: flex; align-items: center; gap: 8px; padding: 14px 16px; background: var(--brand); color: #fff; border-radius: 14px 14px 0 0; font-weight: 700; }
    .chat-header .icon-btn { color: #fff; font-size: 16px; }
    .call-circle { width: 120px; height: 120px; border-radius: 50%; background: var(--brand); margin: 16px auto 16px; }
    .call-circle.responding { animation: speakingPulse 0.5s ease-in-out infinite; }
    @keyframes speakingPulse { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
    .chatbox { background: #fff; }
    .chat p { white-space: pre-line; }
    .chatbox .outgoing p { background: var(--brand); color: #fff; }
    .sender-tag { font-size: 12px; color: var(--muted); margin-top: 4px; display: block; text-align: right; }
    .chat-input { display: flex; gap: 8px; align-items: center; padding: 8px var(--s-2); border-top: 1px solid #e5e7eb; background: #f3f4f6; }
    /* Remove the rule that hides the Send button */
    /* .chat-input .btn-primary { display: none; } */
    .chat-input textarea {border-radius: 12px; border: none; outline: none; font-size: 14px; resize: none; width: 100%; height: 42px; padding: 10px 12px; }
    .chat-panel-header { display: flex; align-items: center; gap: 8px; font-weight: 700; padding: 10px 12px; background: #fff; border-radius: 10px; margin-bottom: 10px; }
    .icon-btn { background: transparent; border: none; cursor: pointer; font-size: 18px; }
    .chatbox { height: 320px; overflow-y: auto; padding: var(--s-2) var(--s-2) 100px var(--s-2); background: #fff; border-radius: 10px; }
    .chat { display: flex; align-items: flex-start; gap: 10px; margin: 10px 0; }
    .chat p { padding: 8px 16px; border-radius: 10px; max-width: 75%; font-size: 0.725rem; }
    .incoming p { background: var(--bot-bg); color: #111827; }
    .outgoing { justify-content: flex-end; }
    .outgoing p { background: var(--user-bg); color: #111827; }
    .chat.typing p { background: var(--bot-bg); color: #111827; }

    /* Bubble container for rich Markdown content */
    .chat .bubble { padding: 0px 8px; border-radius: 10px; max-width: 75%; font-size: 0.725rem; background: var(--bot-bg); color: #111827; }
    .incoming .bubble { background: var(--bot-bg); color: #111827; }
    .outgoing .bubble { background: var(--user-bg); color: #111827; }

    /* Markdown element tweaks inside bubble */
    .chat .bubble h1, .chat .bubble h2, .chat .bubble h3 { font-size: 0.9rem; font-weight: 700; margin: 6px 0; }
    .chat .bubble p { margin: 6px 0; }
    .chat .bubble ul, .chat .bubble ol { margin: 6px 0 6px 16px; }
    .chat .bubble code { background: #e5e7eb; color: #111827; padding: 2px 4px; border-radius: 4px; }
    .chat .bubble pre { background: #0f172a; color: #e2e8f0; padding: 10px; border-radius: 8px; overflow-x: auto; font-size: 0.72rem; }
    .typing { display: inline-flex; gap: 4px; align-items: center; }
    .typing span { width: 6px; height: 6px; border-radius: 50%; background: #9aa1b0; display: inline-block; animation: typingBlink 1.2s infinite; }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBlink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
    .chat.error p { background: #fdecea; color: #b00020; border: 1px solid #f5c2c7; }
    .chat.error i { color: #b00020; }
    `;
    const callStatusCss = `
    /* Call circle + status styles */
    .call-circle { width: 160px; height: 160px; border-radius: 50%; margin: 12px auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,.35); transition: background .2s ease, transform .2s ease; }
    .call-circle.idle { background: var(--brand); }
    .call-circle.recording { background: #ef3b3b; }
    .call-circle button { background: transparent; border: 0; color: #fff; font-weight: 800; font-size: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; }
    #call-icon { font-size: 28px; margin-bottom: 8px; }
    #call-label { font-size: 18px; font-weight: 800; letter-spacing: .5px; }
    /* Status bar */
    .call-status { margin: 12px var(--s-2);  border-radius: 12px; background: rgba(255,255,255,.06); color: var(--muted); text-align: right; font-size: 12px;}
    .call-status.connecting { background: rgba(18,194,103,.18); color: #b8f1d5; }
    .call-status.connected, .call-status.configured { background: rgba(18,194,103,.10); }
    .call-status.error, .call-status.closed { background: rgba(239,59,59,.18); color: #ffb9b9; }
    .call-status.status-connecting { background:#fff3cd; color:#856404; border:1px solid #ffe69c; }
    .call-status.status-connected { background:#d1fae5; color:#065f46; border:1px solid #a7f3d0; }
    .call-status.status-configured { background:#e0f2fe; color:#075985; border:1px solid #bae6fd; }
    .call-status.status-mic_granted { background:#e6fffa; color:#0f766e; border:1px solid #99f6e4; }
    .call-status.status-mic_error, .call-status.status-error { background:#fee2e2; color:#7f1d1d; border:1px solid #fca5a5; }
    .call-status.status-closed { background:#f3f4f6; color:#374151; border:1px solid #e5e7eb; }
  `;
    const rtcAudioCss = `
    .audio-indicator { display: none; justify-content: center; align-items: center; gap: 8px; padding: 16px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; }
    .audio-indicator.active { display: flex; }
    .audio-indicator span { width: 6px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); animation: aiPulse 1s ease-in-out infinite; }
    .audio-indicator span:nth-child(2) { animation-delay: 0.15s; }
    .audio-indicator span:nth-child(3) { animation-delay: 0.3s; }
    .audio-indicator span:nth-child(4) { animation-delay: 0.45s; }
    @keyframes aiPulse { 0%, 100% { height: 12px; } 50% { height: 32px; } }
  `;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  function applyBrand(brandColor) {
    if (brandColor) document.documentElement.style.setProperty("--brand", brandColor);
  }

  // sdk/router.js
  var Router = class {
    constructor(root, routes, onRendered) {
      this.root = root;
      this.routes = routes || {};
      this.currentPage = "welcome";
      this.onRendered = onRendered;
      localStorage.setItem("chatbot_current_page", this.currentPage);
    }
    getPage() {
      return this.currentPage;
    }
    setPage(page) {
      this.currentPage = page;
      this.render();
    }
    render() {
      const page = this.getPage();
      const view = this.routes[page] || this.routes["welcome"];
      this.root.innerHTML = typeof view === "function" ? view() : view;
      if (typeof this.onRendered === "function") this.onRendered(this);
      localStorage.setItem("chatbot_current_page", this.currentPage);
    }
  };

  // sdk/views.js
  function getRoutes(name = "Zentrova") {
    return {
      welcome: () => `
      <div class="welcome-screen">
        <div class="welcome-main">
          <div class="welcome-header">
            <h2>Hi!</h2>
            <p>Welcome to ${name}. Need help? start a conversation with us:</p>
          </div>
          <button id="start-conversation" class="start-conversation-btn" aria-label="Start Conversation">
            <div>
              <div class="title">Start Conversation</div>
              <div class="subtitle">We typically reply in a few minutes</div>
            </div>
            <span class="cta-arrow"><i class="bi bi-send-fill"></i></span>
          </button>
        </div>
        <div class="welcome-footer">
          <button id="footer-chat" class="footer-action"><i class="bi bi-chat-dots"></i><span>Chat</span></button>
          <button id="footer-call" class="footer-action"><i class="bi bi-telephone-outbound"></i><span>Call</span></button>
        </div>
      </div>
    `,
      prechat: () => `
      <div class="welcome-screen">
        <div class="prechat-main">
          <button id="prechat-back-btn" class="icon-btn" aria-label="Back">\u2039</button>
          <p class="prechat-intro">Hi, Welcome to ${name}. Let us know you and how we may help you?</p>
          <div class="prechat-card">
            <form id="prechat-form" class="prechat-form" onsubmit="return false;">
              <input id="prechat-name" type="text" placeholder="Name" />
              <input id="prechat-email" type="email" placeholder="Email" />
              <div class="country-row">
                <select id="country-code">
                  <option value="+234">\u{1F1F3}\u{1F1EC} +234</option>
                  <option value="+1">\u{1F1FA}\u{1F1F8} +1</option>
                  <option value="+44">\u{1F1EC}\u{1F1E7} +44</option>
                </select>
                <input id="prechat-phone" type="tel" placeholder="Phone" />
              </div>
              <input id="prechat-question" type="text" placeholder="What is your question?" />
              <button id="start-chat-btn" class="prechat-start-btn" type="submit"><i class="bi bi-send-fill"></i><span>Start Chat</span></button>
            </form>
          </div>
        </div>
        <div class="welcome-footer">
          <button id="footer-chat" class="footer-action active"><i class="bi bi-chat-dots"></i><span>Chat</span></button>
          <button id="footer-call" class="footer-action"><i class="bi bi-telephone-outbound"></i><span>Call</span></button>
        </div>
      </div>
    `,
      chat: () => `
      <div class="chat-panel">
        <div class="chat-header">
          <button id="chat-back-btn" class="icon-btn" aria-label="Back">\u2039</button>
          Kuda Bot
        </div>
        <div class="chat-panel-body"><ul class="chatbox"></ul></div>
        <div class="chat-input">
          
          <textarea id="chat-input" rows="1" placeholder="Type here and press enter"></textarea>
          <button id="send-btn" class="btn-primary"><i class="bi bi-send-fill"></i></button>
        </div>
      </div>
    `,
      call: () => `
      <div class="">
        <div class="chat-header">
          <button id="call-back" class="icon-btn" aria-label="Back">\u2039</button>
          <span>Calling...</span>
        </div>
        <div class="call-card" style="border-radius:0">
          <p style="text-align:center; color: var(--muted); margin: 0 0 6px;">Talking to</p>
          <h2 style="text-align:center; font-size: 24px; font-weight: 800; margin: 0 0 8px;">${name} Agent</h2>
          <div class="call-circle idle" id="call-circle">
            <audio id="assistantAudio" autoplay></audio>
           
          </div>
          <div style="display:flex; justify-content:center; margin-top: 12px;">
            <button id="call-end" class="call-primary">End Conversation</button>
          </div>
        </div>
      </div>
    `,
      "call-welcome": () => `
      <div class="welcome-screen call-welcome">
        <div class="chat-header call-wellcome-h">
          <button id="call-welcome-back" class="icon-btn" aria-label="Back">\u2039</button>
          <span>Call (${name})</span>
        </div>
        <div class="call-welcome-card" style="margin: var(--s-2);">
          <p style="text-align:center; font-size:0.75rem;color:"#eeeeee";margin-bottom:4px;">Talk to</p>
          <h3 style="text-align:center; margin-bottom:12px;">${name}</h3>
          <div style="display:flex; justify-content:center;">
            <button id="call-welcome-start" class="call-primary">Start</button>
          </div>
        </div>
        <div class="welcome-footer">
          <button id="footer-chat" class="footer-action"><i class="bi bi-chat-dots"></i><span>Chat</span></button>
          <button id="footer-call" class="footer-action active"><i class="bi bi-telephone-outbound"></i><span>Call</span></button>
        </div>
      </div>
    `,
      precall: () => `
      <div class="welcome-screen">
        <div class="chat-header">
          <button id="precall-back" class="icon-btn" aria-label="Back">\u2039</button>
          <span>Call (${name})</span>
        </div>
        <div class="precall-card" style="margin: var(--s-2);">
          <p class="prechat-intro">Hi, Welcome to (${name}). Let us know you and how we may help you?</p>
          <form id="precall-form" class="prechat-form" onsubmit="return false;">
            <input id="precall-name" type="text" placeholder="Name" />
           
            <div class="country-row">
              <select id="precall-country">
                <option value="+234">\u{1F1F3}\u{1F1EC} +234</option>
                <option value="+1">\u{1F1FA}\u{1F1F8} +1</option>
                <option value="+44">\u{1F1EC}\u{1F1E7} +44</option>
              </select>
              <input id="precall-phone" type="tel" placeholder="Phone" />
            </div>
            <button id="precall-start" class="prechat-start-btn" type="submit"><i class="bi bi-send-fill"></i><span>Start Call</span></button>
          </form>
        </div>
        <div class="welcome-footer">
          <button id="footer-chat" class="footer-action"><i class="bi bi-chat-dots"></i><span>Chat</span></button>
          <button id="footer-call" class="footer-action active"><i class="bi bi-telephone-outbound"></i><span>Call</span></button>
        </div>
      </div>
    `
    };
  }

  // sdk/call.js
  var BASE_URL = "https://zentrova-ai.mygrantgenie.com/api/v1";
  var callWS = null;
  var callAudioContext = null;
  var callAudioSource = null;
  var callAudioProcessor = null;
  var callEndInterval = null;
  var micActive = false;
  var callInitInProgress = false;
  var callTerminated = false;
  var currentPlaybackSource = null;
  var pc = null;
  var dataChannel = null;
  var localStream = null;
  var playbackAudioContext = null;
  var playbackAnalyser = null;
  var playbackSourceNode = null;
  var playbackMonitorRAF = null;
  function cleanupCall() {
    try {
      callTerminated = true;
      if (callAudioProcessor) {
        callAudioProcessor.disconnect();
        callAudioProcessor = null;
      }
      if (callAudioSource) {
        callAudioSource.disconnect();
        if (callAudioSource.mediaStream) callAudioSource.mediaStream.getTracks().forEach((t) => t.stop());
        callAudioSource = null;
      }
      try {
        if (currentPlaybackSource) {
          currentPlaybackSource.stop();
          currentPlaybackSource.disconnect();
        }
      } catch (_) {
      }
      currentPlaybackSource = null;
      audioQueue = [];
      isPlayingAudio = false;
      nextPlayTime = 0;
      if (callAudioContext) {
        try {
          callAudioContext.close();
        } catch (_) {
        }
        callAudioContext = null;
      }
      if (callWS) {
        try {
          if (callWS.readyState === WebSocket.OPEN) callWS.close(1e3, "User ended call");
        } catch (_) {
        }
        callWS = null;
      }
      if (callEndInterval) {
        clearInterval(callEndInterval);
        callEndInterval = null;
      }
      try {
        if (dataChannel) {
          try {
            dataChannel.close();
          } catch (_) {
          }
          dataChannel = null;
        }
        if (pc) {
          try {
            pc.close();
          } catch (_) {
          }
          pc = null;
        }
        if (localStream) {
          try {
            localStream.getTracks().forEach((t) => t.stop());
          } catch (_) {
          }
          localStream = null;
        }
        const assistantAudio = document.getElementById("assistantAudio");
        if (assistantAudio) assistantAudio.srcObject = null;
        if (playbackMonitorRAF) {
          cancelAnimationFrame(playbackMonitorRAF);
          playbackMonitorRAF = null;
        }
        try {
          if (playbackAnalyser) playbackAnalyser.disconnect();
        } catch (_) {
        }
        playbackAnalyser = null;
        try {
          if (playbackSourceNode) playbackSourceNode.disconnect();
        } catch (_) {
        }
        playbackSourceNode = null;
        if (playbackAudioContext) {
          try {
            playbackAudioContext.close();
          } catch (_) {
          }
          playbackAudioContext = null;
        }
      } catch (_) {
      }
      micActive = false;
      callInitInProgress = false;
    } catch (_) {
    }
  }
  function getSessionId() {
    let sid = localStorage.getItem("chatbot_session_id");
    if (!sid) {
      sid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
      localStorage.setItem("chatbot_session_id", sid);
    }
    return sid;
  }
  function dispatchCallStatus(status, extra = {}) {
    try {
      window.dispatchEvent(new CustomEvent("chatbot-call-status", { detail: __spreadValues({ status }, extra) }));
    } catch (_) {
    }
  }
  var audioQueue = [];
  var isPlayingAudio = false;
  var nextPlayTime = 0;
  function bindCallViewEvents(router, ctx) {
    const page = router.getPage();
    const conversationId = localStorage.getItem("chatbot_conversation_id");
    if (page === "call-welcome") {
      const back = document.getElementById("call-welcome-back");
      const start = document.getElementById("call-welcome-start");
      back && back.addEventListener("click", () => router.setPage("welcome"));
      start && start.addEventListener("click", () => router.setPage("precall"));
      const fc = document.getElementById("footer-call");
      const fch = document.getElementById("footer-chat");
      fc && fc.classList.add("active");
      fch && fch.classList.remove("active");
      fch && fch.addEventListener("click", () => router.setPage("prechat"));
      return;
    }
    if (page === "precall") {
      let setPrecallBusy = function(busy) {
        if (startBtn) startBtn.disabled = !!busy;
        const card = document.querySelector(".precall-card");
        if (card) card.style.pointerEvents = busy ? "none" : "auto";
        if (card) card.style.opacity = busy ? "0.6" : "1";
      };
      const form = document.getElementById("precall-form");
      const startBtn = document.getElementById("precall-start");
      const backBtn = document.getElementById("precall-back");
      async function initCall() {
        if (callInitInProgress) return;
        callInitInProgress = true;
        setPrecallBusy(true);
        const name = (document.getElementById("precall-name").value || "").trim();
        const code = document.getElementById("precall-country").value || "";
        const phone = (document.getElementById("precall-phone").value || "").trim();
        const message = localStorage.getItem("chatbot_user_question") || "Start call";
        try {
          localStorage.setItem("chatbot_user_name", name);
          localStorage.setItem("chatbot_user_phone", `${code}${phone}`);
          localStorage.setItem("chatbot_user_question", message);
        } catch (_) {
        }
        const chatbotID = ctx && ctx.chatbotID || localStorage.getItem("chatbot_id");
        if (!chatbotID) {
          console.error("Missing chatbotID");
          callInitInProgress = false;
          setPrecallBusy(false);
          return;
        }
        try {
          const res = await fetch(`${BASE_URL}/chatbots/call/${encodeURIComponent(chatbotID)}/start/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
              user_phone: `${code}${phone}`,
              user_name: name
            })
          });
          if (!res.ok) throw new Error("Call init failed");
          const data = await res.json();
          try {
            const convId = data && (data.call_id || data.conversation_id || data.id);
            if (convId) localStorage.setItem("chatbot_conversation_id", String(convId));
          } catch (_) {
          }
          const bot = ctx && ctx.bot;
          const agentId = chatbotID;
          const language = bot && bot.language || localStorage.getItem("chatbot_bot_language") || "English";
          const voice = bot && bot.voice || localStorage.getItem("chatbot_bot_voice") || "alloy";
          const welcomeMessage = bot && bot.welcome_message || localStorage.getItem("chatbot_bot_welcome_message") || "Hello! How can I assist you today?";
          await new Promise((r) => setTimeout(r, 200));
          startRTCSession({ agentId, language, voice, welcomeMessage });
          router.setPage("call");
        } catch (err) {
          console.error("Init call error:", err);
          dispatchCallStatus("error", { error: (err == null ? void 0 : err.message) || "Initialization failed" });
          alert("Unable to start call. Please try again.");
        } finally {
          callInitInProgress = false;
          setPrecallBusy(false);
        }
      }
      form && form.addEventListener("submit", (e) => {
        e.preventDefault();
        initCall();
      });
      startBtn && startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        initCall();
      });
      backBtn && backBtn.addEventListener("click", () => router.setPage("call-welcome"));
      return;
    }
    if (page === "call") {
      const back = document.getElementById("call-back");
      const end = document.getElementById("call-end");
      async function endAndClose() {
        try {
          const convId = localStorage.getItem("chatbot_conversation_id");
          if (convId) {
            await fetch(`${BASE_URL}/chatbots/call/${encodeURIComponent(convId)}/complete/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" }
            });
            try {
              localStorage.removeItem("chatbot_conversation_id");
            } catch (_) {
            }
          } else {
            const sid = getSessionId();
            await fetch(`${BASE_URL}/chatbots/conversations/${encodeURIComponent(sid)}/end/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" }
            });
          }
        } catch (_) {
        }
        callTerminated = true;
        cleanupCall();
        router.setPage("call-welcome");
      }
      back && back.addEventListener("click", (e) => {
        e.preventDefault();
        endAndClose();
      });
      end && end.addEventListener("click", (e) => {
        e.preventDefault();
        endAndClose();
      });
      return;
    }
  }
  async function fetchEphemeralToken(agentId, language, voice, welcomeMessage) {
    const tokenUrl = "https://zentrova-chatbot.mygrantgenie.com/realtime/token";
    let customApis = null;
    try {
      const raw = localStorage.getItem("chatbot_custom_apis");
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to obtain token: ${errorText}`);
    }
    const payload = await response.json();
    if (!payload.value) {
      throw new Error("Token response missing value field");
    }
    return payload.value;
  }
  async function handleFunctionCall(functionName, functionCallId, args) {
    try {
      const parsedArgs = JSON.parse(args || "{}");
      const response = await fetch("https://zentrova-chatbot.mygrantgenie.com/realtime/function-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ function_name: functionName, arguments: parsedArgs })
      });
      if (!response.ok) throw new Error(`Function call failed: ${response.statusText}`);
      const result = await response.json();
      if (dataChannel && dataChannel.readyState === "open") {
        const outputEvent = {
          type: "conversation.item.create",
          item: { type: "function_call_output", call_id: functionCallId, output: JSON.stringify(result) }
        };
        dataChannel.send(JSON.stringify(outputEvent));
        dataChannel.send(JSON.stringify({ type: "response.create" }));
      }
    } catch (error) {
      if (dataChannel && dataChannel.readyState === "open") {
        const outputEvent = {
          type: "conversation.item.create",
          item: { type: "function_call_output", call_id: functionCallId, output: JSON.stringify({ error: (error == null ? void 0 : error.message) || "Function call error" }) }
        };
        dataChannel.send(JSON.stringify(outputEvent));
      }
    }
  }
  async function startRTCSession({ agentId, language, voice, welcomeMessage }) {
    try {
      dispatchCallStatus("connecting");
      const storedAgentId = localStorage.getItem("chatbot_id") || agentId;
      const storedVoice = localStorage.getItem("chatbot_bot_voice") || voice;
      const storedLanguage = localStorage.getItem("chatbot_bot_language") || language;
      const storedWelcome = localStorage.getItem("chatbot_bot_welcome_message") || welcomeMessage;
      const ephemeralKey = await fetchEphemeralToken(storedAgentId, storedLanguage, storedVoice, storedWelcome);
      pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      pc.ontrack = (event) => {
        const assistantAudio = document.getElementById("assistantAudio");
        if (assistantAudio) {
          assistantAudio.srcObject = event.streams[0];
          assistantAudio.play().catch(() => {
          });
        }
        startPlaybackMonitor(event.streams[0]);
      };
      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "connected") {
          dispatchCallStatus("connected");
        } else if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
          dispatchCallStatus("error", { error: "Connection lost" });
          cleanupCall();
        }
      };
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      dispatchCallStatus("mic_granted");
      dataChannel = pc.createDataChannel("oai-events");
      dataChannel.onopen = () => {
        dispatchCallStatus("configured");
        dataChannel.send(JSON.stringify({ type: "response.create" }));
      };
      dataChannel.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const circle = document.getElementById("call-circle");
          if (payload.type === "response.audio.delta") {
            circle && circle.classList.add("responding");
          } else if (payload.type === "response.audio.done") {
            circle && circle.classList.remove("responding");
          } else if (payload.type === "response.function_call_arguments.done") {
            handleFunctionCall(payload.name, payload.call_id, payload.arguments);
          } else if (payload.type === "response.done") {
            dispatchCallStatus("connected");
          }
        } catch (_) {
        }
      };
      dataChannel.onerror = (error) => {
        dispatchCallStatus("error", { error: "Data channel error" });
      };
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" },
        body: offer.sdp
      });
      if (!sdpResponse.ok) {
        const errText = await sdpResponse.text();
        throw new Error(`OpenAI SDP error ${sdpResponse.status}: ${errText}`);
      }
      const answer = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answer });
    } catch (error) {
      dispatchCallStatus("error", { error: error.message });
      cleanupCall();
    }
  }
  function startPlaybackMonitor(stream) {
    const circle = document.getElementById("call-circle");
    if (!circle || !stream) return;
    try {
      let tick = function() {
        try {
          playbackAnalyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          if (rms > 0.02) circle.classList.add("responding");
          else circle.classList.remove("responding");
        } catch (_) {
        }
        playbackMonitorRAF = requestAnimationFrame(tick);
      };
      if (playbackMonitorRAF) {
        cancelAnimationFrame(playbackMonitorRAF);
        playbackMonitorRAF = null;
      }
      if (playbackAudioContext) {
        try {
          playbackAudioContext.close();
        } catch (_) {
        }
        playbackAudioContext = null;
      }
      playbackAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      playbackSourceNode = playbackAudioContext.createMediaStreamSource(stream);
      playbackAnalyser = playbackAudioContext.createAnalyser();
      playbackAnalyser.fftSize = 2048;
      playbackSourceNode.connect(playbackAnalyser);
      const data = new Uint8Array(playbackAnalyser.frequencyBinCount);
      tick();
    } catch (_) {
    }
  }

  // sdk/events.js
  function wireShellEvents(router) {
    const toggleBtn = document.querySelector(".chatbot-toggler");
    const actions = document.querySelector(".chat-actions");
    const toggleIcon = toggleBtn ? toggleBtn.querySelector("i") : null;
    function updateTogglerIcon() {
      if (!toggleIcon) return;
      toggleIcon.className = actions.classList.contains("show") ? "bi bi-x-lg" : "bi bi-chat-dots";
    }
    toggleBtn && toggleBtn.addEventListener("click", () => {
      const isOpen = actions.classList.toggle("show");
      if (!isOpen) actions.classList.remove("show");
      updateTogglerIcon();
    });
    const pillToggle = document.getElementById("pill-toggle");
    pillToggle && pillToggle.addEventListener("click", () => {
      const prev = router.getPage();
      if (prev) localStorage.setItem("chatbot_prev_page", prev);
      document.body.classList.remove("show-chatbot");
      updateTogglerIcon();
    });
    const actionChat = document.getElementById("action-chat");
    const actionCall = document.getElementById("action-call");
    actionChat && actionChat.addEventListener("click", () => {
      actions.classList.remove("show");
      document.body.classList.add("show-chatbot");
      updateTogglerIcon();
      const storedPage = localStorage.getItem("chatbot_current_page");
      const hasUser = localStorage.getItem("chatbot_user_name");
      router.setPage(storedPage === "chat" || hasUser ? "chat" : "welcome");
    });
    actionCall && actionCall.addEventListener("click", () => {
      actions.classList.remove("show");
      document.body.classList.add("show-chatbot");
      updateTogglerIcon();
      router.setPage("call-welcome");
    });
  }
  function addMessage(text, type) {
    const chatbox = document.querySelector(".chatbox");
    if (!chatbox) return;
    const li = document.createElement("li");
    if (type === "typing") {
      li.className = "chat typing";
      li.innerHTML = `<i class="bi bi-robot"></i><p class="typing"><span></span><span></span><span></span></p>`;
    } else {
      const variant = type === "error" ? "error" : type;
      li.className = `chat ${variant}`;
      if (variant === "incoming") {
        li.innerHTML = `<i class="bi bi-robot"></i><div class="bubble">${renderMarkdown(text)}</div>`;
      } else if (variant === "error") {
        li.innerHTML = `<i class="bi bi-robot"></i><p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
      } else {
        li.innerHTML = `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
      }
    }
    chatbox.appendChild(li);
    chatbox.scrollTop = chatbox.scrollHeight;
    return li;
  }
  function escapeHtml(str) {
    return (str || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  }
  function renderMarkdown(md) {
    const esc = escapeHtml(md || "");
    const lines = esc.split("\n");
    let html = "";
    let inCode = false;
    let listType = null;
    function closeList() {
      if (listType) {
        html += `</${listType}>`;
        listType = null;
      }
    }
    function applyInline(t) {
      return t.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.trim().startsWith("```")) {
        if (!inCode) {
          closeList();
          inCode = true;
          html += "<pre><code>";
        } else {
          inCode = false;
          html += "</code></pre>";
        }
        continue;
      }
      if (inCode) {
        html += line + "\n";
        continue;
      }
      if (/^###\s+/.test(line)) {
        closeList();
        html += "<h3>" + line.replace(/^###\s+/, "") + "</h3>";
        continue;
      }
      if (/^##\s+/.test(line)) {
        closeList();
        html += "<h2>" + line.replace(/^##\s+/, "") + "</h2>";
        continue;
      }
      if (/^#\s+/.test(line)) {
        closeList();
        html += "<h1>" + line.replace(/^#\s+/, "") + "</h1>";
        continue;
      }
      if (/^\s*\d+\.\s+/.test(line)) {
        const item = line.replace(/^\s*\d+\.\s+/, "");
        if (listType !== "ol") {
          closeList();
          listType = "ol";
          html += "<ol>";
        }
        html += "<li>" + applyInline(item) + "</li>";
        continue;
      }
      if (/^\s*[-*]\s+/.test(line)) {
        const item = line.replace(/^\s*[-*]\s+/, "");
        if (listType !== "ul") {
          closeList();
          listType = "ul";
          html += "<ul>";
        }
        html += "<li>" + applyInline(item) + "</li>";
        continue;
      }
      if (line.trim() === "") {
        closeList();
        continue;
      }
      closeList();
      html += "<p>" + applyInline(line) + "</p>";
    }
    closeList();
    return html;
  }
  function getHistoryKey(chatbotID) {
    return `chatbot_history_${chatbotID || "default"}`;
  }
  function loadHistory(chatbotID) {
    try {
      return JSON.parse(localStorage.getItem(getHistoryKey(chatbotID))) || [];
    } catch (_) {
      return [];
    }
  }
  function saveHistory(chatbotID, history) {
    try {
      localStorage.setItem(getHistoryKey(chatbotID), JSON.stringify(history));
    } catch (_) {
    }
  }
  function renderHistory(history) {
    history.forEach((m) => addMessage(m.text, m.type));
  }
  var BASE_URL2 = "https://zentrova-ai.mygrantgenie.com/api/v1";
  function bindViewEvents(router, ctx) {
    const page = router.getPage();
    const bot = ctx && ctx.bot;
    const chatbotID = ctx && ctx.chatbotID;
    const welcomeMsg = bot && bot.welcome_message || "Hello! How can I help you today?";
    if (page === "welcome") {
      const start = document.getElementById("start-conversation");
      start && start.addEventListener("click", () => router.setPage("prechat"));
      const footerChat = document.getElementById("footer-chat");
      footerChat && footerChat.addEventListener("click", () => router.setPage("prechat"));
      const footerCall = document.getElementById("footer-call");
      footerCall && footerCall.addEventListener("click", () => router.setPage("call-welcome"));
    } else if (page === "call-welcome") {
      const back = document.getElementById("call-welcome-back");
      const start = document.getElementById("call-welcome-start");
      back && back.addEventListener("click", () => router.setPage("welcome"));
      start && start.addEventListener("click", () => router.setPage("precall"));
      const fc = document.getElementById("footer-call");
      const fch = document.getElementById("footer-chat");
      fc && fc.classList.add("active");
      fch && fch.classList.remove("active");
      fch && fch.addEventListener("click", () => router.setPage("prechat"));
    } else if (page === "prechat") {
      const form = document.getElementById("prechat-form");
      form && form.addEventListener("submit", () => {
        const name = (document.getElementById("prechat-name").value || "").trim();
        const email = (document.getElementById("prechat-email").value || "").trim();
        const code = document.getElementById("country-code").value || "";
        const phone = (document.getElementById("prechat-phone").value || "").trim();
        const question = (document.getElementById("prechat-question").value || "").trim();
        localStorage.setItem("chatbot_user_name", name);
        localStorage.setItem("chatbot_user_email", email);
        localStorage.setItem("chatbot_user_phone", `${code}${phone}`);
        localStorage.setItem("chatbot_user_question", question);
        router.setPage("chat");
      });
      const startBtn = document.getElementById("start-chat-btn");
      startBtn && startBtn.addEventListener("click", () => {
        const formEl = document.getElementById("prechat-form");
        formEl && formEl.dispatchEvent(new Event("submit"));
      });
      const preBack = document.getElementById("prechat-back-btn");
      preBack && preBack.addEventListener("click", () => router.setPage("welcome"));
      const footerChat = document.getElementById("footer-chat");
      const footerCall = document.getElementById("footer-call");
      footerChat && footerChat.addEventListener("click", () => router.setPage("prechat"));
      footerCall && footerCall.addEventListener("click", () => router.setPage("call"));
      footerChat && footerChat.classList.add("active");
      footerCall && footerCall.classList.remove("active");
    } else if (page === "chat") {
      let getSessionId2 = function() {
        let sid = localStorage.getItem("chatbot_session_id");
        if (!sid) {
          sid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
            return v.toString(16);
          });
          localStorage.setItem("chatbot_session_id", sid);
        }
        return sid;
      }, persistMessage = function(text, type) {
        if (type === "error") return;
        history.push({ text, type, ts: Date.now() });
        saveHistory(chatbotID, history);
      };
      const name = localStorage.getItem("chatbot_user_name") || "Guest";
      const email = localStorage.getItem("chatbot_user_email") || "";
      const phone = localStorage.getItem("chatbot_user_phone") || "";
      const question = localStorage.getItem("chatbot_user_question") || "";
      let history = loadHistory(chatbotID);
      if (history.length > 0) {
        renderHistory(history);
      } else {
        addMessage(welcomeMsg, "incoming");
      }
      const input = document.getElementById("chat-input");
      const send = document.getElementById("send-btn");
      const attach = document.getElementById("attach-btn");
      async function sendToBot(userText) {
        var _a;
        addMessage(userText, "outgoing");
        persistMessage(userText, "outgoing");
        const last = document.querySelector(".chatbox li:last-child");
        if (last && last.classList.contains("outgoing")) {
          const tag = document.createElement("span");
          tag.className = "sender-tag";
          tag.textContent = name ? name : "You";
          last.appendChild(tag);
        }
        const stopTyping = showTyping();
        const payload = {
          session_id: getSessionId2(),
          message: userText,
          user_email: email,
          user_name: name,
          user_phone: phone
        };
        try {
          if (!chatbotID) throw new Error("Missing chatbotID");
          const res = await fetch(`${BASE_URL2}/chatbots/widget/${encodeURIComponent(chatbotID)}/chat/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const ok = res.ok;
          const data = ok ? await res.json() : null;
          stopTyping();
          if (!ok) throw new Error("Request failed");
          const botReply = data && data.bot_message && data.bot_message.message || ((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.response) || (data == null ? void 0 : data.response) || (data == null ? void 0 : data.message) || "Okay.";
          addMessage(botReply, "incoming");
          persistMessage(botReply, "incoming");
        } catch (err) {
          stopTyping();
          const errMsg = "Could not process your request at the moment. Please try again.";
          addMessage(errMsg, "error");
        }
      }
      if (question && history.length === 0) {
        sendToBot(question);
      }
      send && send.addEventListener("click", () => {
        const text = (input && input.value || "").trim();
        if (!text) return;
        input.value = "";
        sendToBot(text);
      });
      input && input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const text = (input && input.value || "").trim();
          if (!text) return;
          input.value = "";
          sendToBot(text);
        }
      });
      attach && attach.addEventListener("click", () => {
      });
      const back = document.getElementById("chat-back-btn");
      back && back.addEventListener("click", () => router.setPage("prechat"));
    } else if (page === "call-welcome" || page === "precall" || page === "call") {
      return bindCallViewEvents(router, ctx);
    } else if (page === "prechat") {
      const form = document.getElementById("prechat-form");
      form && form.addEventListener("submit", () => {
        const name = (document.getElementById("prechat-name").value || "").trim();
        const email = (document.getElementById("prechat-email").value || "").trim();
        const code = document.getElementById("country-code").value || "";
        const phone = (document.getElementById("prechat-phone").value || "").trim();
        const question = (document.getElementById("prechat-question").value || "").trim();
        localStorage.setItem("chatbot_user_name", name);
        localStorage.setItem("chatbot_user_email", email);
        localStorage.setItem("chatbot_user_phone", `${code}${phone}`);
        localStorage.setItem("chatbot_user_question", question);
        router.setPage("chat");
      });
      const startBtn = document.getElementById("start-chat-btn");
      startBtn && startBtn.addEventListener("click", () => {
        const formEl = document.getElementById("prechat-form");
        formEl && formEl.dispatchEvent(new Event("submit"));
      });
      const preBack = document.getElementById("prechat-back-btn");
      preBack && preBack.addEventListener("click", () => router.setPage("welcome"));
      const footerChat = document.getElementById("footer-chat");
      const footerCall = document.getElementById("footer-call");
      footerChat && footerChat.addEventListener("click", () => router.setPage("prechat"));
      footerCall && footerCall.addEventListener("click", () => router.setPage("call"));
      footerChat && footerChat.classList.add("active");
      footerCall && footerCall.classList.remove("active");
    } else if (page === "chat") {
      let getSessionId2 = function() {
        let sid = localStorage.getItem("chatbot_session_id");
        if (!sid) {
          sid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
            return v.toString(16);
          });
          localStorage.setItem("chatbot_session_id", sid);
        }
        return sid;
      }, persistMessage = function(text, type) {
        if (type === "error") return;
        history.push({ text, type, ts: Date.now() });
        saveHistory(chatbotID, history);
      };
      const name = localStorage.getItem("chatbot_user_name") || "Guest";
      const email = localStorage.getItem("chatbot_user_email") || "";
      const phone = localStorage.getItem("chatbot_user_phone") || "";
      const question = localStorage.getItem("chatbot_user_question") || "";
      let history = loadHistory(chatbotID);
      if (history.length > 0) {
        renderHistory(history);
      } else {
        addMessage(welcomeMsg, "incoming");
      }
      const input = document.getElementById("chat-input");
      const send = document.getElementById("send-btn");
      const attach = document.getElementById("attach-btn");
      async function sendToBot(userText) {
        var _a;
        addMessage(userText, "outgoing");
        persistMessage(userText, "outgoing");
        const last = document.querySelector(".chatbox li:last-child");
        if (last && last.classList.contains("outgoing")) {
          const tag = document.createElement("span");
          tag.className = "sender-tag";
          tag.textContent = name ? name : "You";
          last.appendChild(tag);
        }
        const stopTyping = showTyping();
        const payload = {
          session_id: getSessionId2(),
          message: userText,
          user_email: email,
          user_name: name,
          user_phone: phone
        };
        try {
          if (!chatbotID) throw new Error("Missing chatbotID");
          const res = await fetch(`${BASE_URL2}/chatbots/widget/${encodeURIComponent(chatbotID)}/chat/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const ok = res.ok;
          const data = ok ? await res.json() : null;
          stopTyping();
          if (!ok) throw new Error("Request failed");
          const botReply = data && data.bot_message && data.bot_message.message || ((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.response) || (data == null ? void 0 : data.response) || (data == null ? void 0 : data.message) || "Okay.";
          addMessage(botReply, "incoming");
          persistMessage(botReply, "incoming");
        } catch (err) {
          stopTyping();
          const errMsg = "Could not process your request at the moment. Please try again.";
          addMessage(errMsg, "error");
        }
      }
      if (question && history.length === 0) {
        sendToBot(question);
      }
      send && send.addEventListener("click", () => {
        const text = (input && input.value || "").trim();
        if (!text) return;
        input.value = "";
        sendToBot(text);
      });
      input && input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const text = (input && input.value || "").trim();
          if (!text) return;
          input.value = "";
          sendToBot(text);
        }
      });
      attach && attach.addEventListener("click", () => {
      });
      const back = document.getElementById("chat-back-btn");
      back && back.addEventListener("click", () => router.setPage("prechat"));
    } else if (page === "call-welcome") {
      const back = document.getElementById("call-back");
      const end = document.getElementById("call-end");
      back && back.addEventListener("click", () => router.setPage("call-welcome"));
      end && end.addEventListener("click", () => router.setPage("call-welcome"));
    }
  }
  function showTyping() {
    const el = addMessage("", "typing");
    return function stopTyping() {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
  }
  window.addEventListener("chatbot-call-status", (ev) => {
  });
  window.addEventListener("chatbot-call-status", (ev) => {
    var _a;
    const status = ((_a = ev == null ? void 0 : ev.detail) == null ? void 0 : _a.status) || "";
    const endBtn = document.getElementById("call-end");
    const isConnecting = status === "connecting";
    if (endBtn) {
      endBtn.classList.toggle("loading", isConnecting);
      endBtn.disabled = isConnecting;
    }
  });

  // chatbot-sdk.js
  var DEFAULT_BRAND = "Zentrova";
  var BASE_URL3 = "https://zentrova-ai.mygrantgenie.com/api/v1";
  function createShell() {
    const toggle = document.createElement("button");
    toggle.className = "chatbot-toggler";
    toggle.setAttribute("aria-label", "Open chat");
    toggle.innerHTML = '<i class="bi bi-chat-dots"></i>';
    const actions = document.createElement("div");
    actions.className = "chat-actions";
    actions.innerHTML = `
    <button id="action-chat" class="chat-action"><i class="bi bi-chat-dots"></i> Chat</button>
    <button id="action-call" class="chat-action"><i class="bi bi-telephone"></i> Call</button>
  `;
    const pill = document.createElement("div");
    pill.className = "powered-pill";
    pill.innerHTML = `
    <span>Powered by <span class="brand">Zentrova</span></span>
    <button class="pill-btn">Create Yours</button>
    <button id="pill-toggle" class="pill-toggle" aria-label="Hide"><i class="bi bi-chevron-down"></i></button>
  `;
    const shell = document.createElement("div");
    shell.className = "chatbot";
    shell.innerHTML = '<div id="chatbot-content"></div>';
    document.body.appendChild(toggle);
    document.body.appendChild(actions);
    document.body.appendChild(pill);
    document.body.appendChild(shell);
    const contentRoot = shell.querySelector("#chatbot-content");
    return { toggle, actions, pill, shell, contentRoot };
  }
  function applyPosition(position) {
    const toggle = document.querySelector(".chatbot-toggler");
    const actions = document.querySelector(".chat-actions");
    const shell = document.querySelector(".chatbot");
    const pill = document.querySelector(".powered-pill");
    const right = position === "bottom-left" ? "unset" : "24px";
    const left = position === "bottom-left" ? "24px" : "unset";
    [toggle, actions, shell, pill].forEach((el) => {
      if (!el) return;
      el.style.right = right;
      el.style.left = left;
    });
  }
  async function fetchBotDetails(chatbotID) {
    const res = await fetch(`${BASE_URL3}/chatbots/widget/${encodeURIComponent(chatbotID)}/`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to load bot configuration");
    return res.json();
  }
  async function createSDK({ agentId, position, brandColor, brandName } = {}) {
    const chatbotID = agentId;
    try {
      const prevId = localStorage.getItem("chatbot_id");
      if (prevId && chatbotID && prevId !== chatbotID) {
        localStorage.clear();
      }
    } catch (_) {
    }
    importFonts();
    injectStyles();
    let bot = null;
    try {
      bot = chatbotID ? await fetchBotDetails(chatbotID) : null;
    } catch (e) {
    }
    const effectiveBrand = bot && bot.brand_color || brandColor || "#5b2a86";
    const effectivePosition = bot && bot.widget_settings && bot.widget_settings.position || position || "bottom-right";
    const autoOpen = !!(bot && bot.widget_settings && bot.widget_settings.auto_open);
    const name = bot && (bot.name || bot.organization_name) || brandName || DEFAULT_BRAND;
    const welcomeMessage = bot && bot.welcome_message || "Hello! How can I help you today?";
    try {
      localStorage.setItem("chatbot_id", chatbotID || "");
      localStorage.setItem("chatbot_bot_voice", bot && bot.voice || "alloy");
      localStorage.setItem("chatbot_bot_language", bot && bot.language || "English");
      localStorage.setItem("chatbot_bot_welcome_message", welcomeMessage);
    } catch (_) {
    }
    applyBrand(effectiveBrand);
    const { toggle, actions, pill, shell, contentRoot } = createShell();
    applyPosition(effectivePosition);
    const routes = getRoutes(name);
    const ctx = { chatbotID, bot, brandColor: effectiveBrand, position: effectivePosition, brandName: name, welcomeMessage };
    const router = new Router(contentRoot, routes, () => bindViewEvents(router, ctx));
    (function ensureSessionId() {
      let sid = localStorage.getItem("chatbot_session_id");
      if (!sid) {
        sid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
        localStorage.setItem("chatbot_session_id", sid);
      }
    })();
    const storedPage = localStorage.getItem("chatbot_current_page");
    if (storedPage) router.currentPage = storedPage;
    wireShellEvents(router);
    router.render();
  }
  function init({ agentId, position = "bottom-right", brandColor = "#5b2a86", brandName } = {}) {
    createSDK({ agentId, position, brandColor, brandName });
  }
  var ChatbotSDK = { init };
  if (typeof window !== "undefined") window.ChatbotSDK = ChatbotSDK;
  return __toCommonJS(chatbot_sdk_exports);
})();
