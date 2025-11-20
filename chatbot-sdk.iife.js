var ChatbotSDK=(()=>{var J=Object.defineProperty;var be=Object.getOwnPropertyDescriptor;var ye=Object.getOwnPropertyNames;var xe=Object.prototype.hasOwnProperty;var ve=(e,t)=>{for(var n in t)J(e,n,{get:t[n],enumerable:!0})},we=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let c of ye(t))!xe.call(e,c)&&c!==n&&J(e,c,{get:()=>t[c],enumerable:!(o=be(t,c))||o.enumerable});return e};var _e=e=>we(J({},"__esModule",{value:!0}),e);var Oe={};ve(Oe,{ChatbotSDK:()=>he,init:()=>fe});function Q(e){let t=document.createElement("link");t.rel="stylesheet",t.href=e,document.head.appendChild(t)}function ee(){Q("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css"),Q("https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap")}function te(){let e=`
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
    `,t=`
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
  `,n=`
    .audio-indicator { display: none; justify-content: center; align-items: center; gap: 8px; padding: 16px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; }
    .audio-indicator.active { display: flex; }
    .audio-indicator span { width: 6px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); animation: aiPulse 1s ease-in-out infinite; }
    .audio-indicator span:nth-child(2) { animation-delay: 0.15s; }
    .audio-indicator span:nth-child(3) { animation-delay: 0.3s; }
    .audio-indicator span:nth-child(4) { animation-delay: 0.45s; }
    @keyframes aiPulse { 0%, 100% { height: 12px; } 50% { height: 32px; } }
  `,o=document.createElement("style");o.type="text/css",o.appendChild(document.createTextNode(e)),document.head.appendChild(o)}function oe(e){e&&document.documentElement.style.setProperty("--brand",e)}var q=class{constructor(t,n,o){this.root=t,this.routes=n||{},this.currentPage="welcome",this.onRendered=o,localStorage.setItem("chatbot_current_page",this.currentPage)}getPage(){return this.currentPage}setPage(t){this.currentPage=t,this.render()}render(){let t=this.getPage(),n=this.routes[t]||this.routes.welcome;this.root.innerHTML=typeof n=="function"?n():n,typeof this.onRendered=="function"&&this.onRendered(this),localStorage.setItem("chatbot_current_page",this.currentPage)}};function ne(e="Zentrova"){return{welcome:()=>`
      <div class="welcome-screen">
        <div class="welcome-main">
          <div class="welcome-header">
            <h2>Hi!</h2>
            <p>Welcome to ${e}. Need help? start a conversation with us:</p>
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
    `,prechat:()=>`
      <div class="welcome-screen">
        <div class="prechat-main">
          <button id="prechat-back-btn" class="icon-btn" aria-label="Back">\u2039</button>
          <p class="prechat-intro">Hi, Welcome to ${e}. Let us know you and how we may help you?</p>
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
              <button id="start-chat-btn" class="prechat-start-btn" type="submit" disabled><i class="bi bi-send-fill"></i><span>Start Chat</span></button>
            </form>
          </div>
        </div>
        <div class="welcome-footer">
          <button id="footer-chat" class="footer-action active"><i class="bi bi-chat-dots"></i><span>Chat</span></button>
          <button id="footer-call" class="footer-action"><i class="bi bi-telephone-outbound"></i><span>Call</span></button>
        </div>
      </div>
    `,chat:()=>`
      <div class="chat-panel">
        <div class="chat-header">
          <button id="chat-back-btn" class="icon-btn" aria-label="Back">\u2039</button>
          ${e}
        </div>
        <div class="chat-panel-body"><ul class="chatbox"></ul></div>
        <div class="chat-input">
          
          <textarea id="chat-input" rows="1" placeholder="Type here and press enter"></textarea>
          <button id="send-btn" class="btn-primary"><i class="bi bi-send-fill"></i></button>
        </div>
      </div>
    `,call:()=>`
      <div class="">
        <div class="chat-header">
          <button id="call-back" class="icon-btn" aria-label="Back">\u2039</button>
          <span>Calling...</span>
        </div>
        <div class="call-card" style="border-radius:0">
          <p style="text-align:center; color: var(--muted); margin: 0 0 6px;">Talking to</p>
          <h2 style="text-align:center; font-size: 24px; font-weight: 800; margin: 0 0 8px;">${e} </h2>
          <div id="call-connecting" style="text-align:center; font-size: 0.9rem; color: var(--muted); margin-bottom: 8px; display:none;">
            Connecting...
          </div>
          <div class="call-circle idle" id="call-circle">
            <audio id="assistantAudio" autoplay></audio>
           
          </div>
          <div style="display:flex; justify-content:center; margin-top: 12px;">
            <button id="call-end" class="call-primary">End Conversation</button>
          </div>
        </div>
      </div>
    `,"call-welcome":()=>`
      <div class="welcome-screen call-welcome">
        <div class="chat-header call-wellcome-h">
          <button id="call-welcome-back" class="icon-btn" aria-label="Back">\u2039</button>
          <span>Call (${e})</span>
        </div>
        <div class="call-welcome-card" style="margin: var(--s-2);">
          <p style="text-align:center; font-size:0.75rem;color:"#eeeeee";margin-bottom:4px;">Talk to</p>
          <h3 style="text-align:center; margin-bottom:12px;">${e}</h3>
          <div style="display:flex; justify-content:center;">
            <button id="call-welcome-start" class="call-primary">Start</button>
          </div>
        </div>
        <div class="welcome-footer">
          <button id="footer-chat" class="footer-action"><i class="bi bi-chat-dots"></i><span>Chat</span></button>
          <button id="footer-call" class="footer-action active"><i class="bi bi-telephone-outbound"></i><span>Call</span></button>
        </div>
      </div>
    `,precall:()=>`
      <div class="welcome-screen">
        <div class="chat-header">
          <button id="precall-back" class="icon-btn" aria-label="Back">\u2039</button>
          <span>Call (${e})</span>
        </div>
        <div class="precall-card" style="margin: var(--s-2);">
          <p class="prechat-intro">Hi, Welcome to (${e}). Let us know you and how we may help you?</p>
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
            <div class="checkbox-row" style="display:flex; align-items:center; gap:8px;">
              <input id="precall-consent" type="checkbox" />
              <label for="precall-consent" style="font-size: 12px; color: var(--muted);">By sharing your details, you agree to our GDPR/CCPA-compliant collection and use of your data for AI support services.</label>
            </div>
            <button id="precall-start" class="prechat-start-btn" type="submit" disabled><i class="bi bi-send-fill"></i><span>Start Call</span></button>
          </form>
        </div>
        <div class="welcome-footer">
          <button id="footer-chat" class="footer-action"><i class="bi bi-chat-dots"></i><span>Chat</span></button>
          <button id="footer-call" class="footer-action active"><i class="bi bi-telephone-outbound"></i><span>Call</span></button>
        </div>
      </div>
    `,"postcall-transfer":()=>`
      <div class="welcome-screen" style="padding: var(--s-2); ">
        <div class="call-card" style="border-radius: 12px; text-align:center; padding: 24px; display: flex; flex-direction: column; align-items: center;">
          <div style="width:72px; height:72px; border-radius:50%; background:#000; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px; box-shadow:0 4px 16px rgba(0,0,0,0.2);">
            <i class="bi bi-telephone" style="color:#fff; font-size:28px;"></i>
          </div>
          <h3 style="margin: 0 0 4px;">Not satisfied?</h3>
          <p style="color: var(--muted); margin: 0 0 16px;">Speak to us directly.</p>
          <div style="display:flex; justify-content:center; gap: 12px;">
            <button id="transfer-call-now" class="call-primary" style="min-width:120px; border-radius:24px;">Call Now</button>
            <button id="transfer-close" class="btn-secondary" style="min-width:120px;border-radius:24px; border:1px solid #000; background:#fff; color:#000;">Close</button>
          </div>
        </div>
      </div>
    `}}function ke(e){try{if(!e||e.length!==2)return"";let t=[...e.toUpperCase()].map(n=>127397+n.charCodeAt(0));return String.fromCodePoint(...t)}catch{return""}}async function j(e,t="+234"){let n=document.getElementById(e);if(n){try{n.innerHTML='<option value="">Loading countries...</option>'}catch{}try{let o=await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd");if(!o.ok)throw new Error("Failed to fetch countries");let c=await o.json(),i=[];for(let s of c){let p=s?.name?.common||"",r=s?.cca2||"",d=s?.idd?.root||"",u=Array.isArray(s?.idd?.suffixes)?s.idd.suffixes:[];if(!p||!d||u.length===0)continue;let _=ke(r);for(let h of u){let y=`${d}${h}`;i.push({name:p,dial:y,flag:_})}}i.sort((s,p)=>s.name.localeCompare(p.name));let a="";for(let s of i){let p=s.dial===t?" selected":"",r=`${s.flag?s.flag+" ":""}${s.name} (${s.dial})`;a+=`<option value="${s.dial}"${p}>${r}</option>`}if(a)n.innerHTML=a;else throw new Error("No countries with dialing codes")}catch(o){console.warn("Country population failed:",o?.message||o);try{(!n.innerHTML||n.innerHTML.includes("Loading countries"))&&(n.innerHTML=['<option value="+234">\u{1F1F3}\u{1F1EC} Nigeria (+234)</option>','<option value="+1">\u{1F1FA}\u{1F1F8} United States (+1)</option>','<option value="+44">\u{1F1EC}\u{1F1E7} United Kingdom (+44)</option>'].join(""))}catch{}}}}var K="https://api.zentai.cloud/api/v1",ae="https://chatbot.zentai.cloud/",H=null,V=null,z=null,G=null,Y=null,Ee=!1,$=!1,W=!1,U=null,C=null,I=null,T=null,M=null,P=null,R=null,O=null,L=null,D=Date.now(),A=null,X=!1;function F(){D=Date.now()}function ce(){try{W=!0,G&&(G.disconnect(),G=null),z&&(z.disconnect(),z.mediaStream&&z.mediaStream.getTracks().forEach(e=>e.stop()),z=null);try{U&&(U.stop(),U.disconnect())}catch{}if(U=null,Ie=[],Ce=!1,Be=0,V){try{V.close()}catch{}V=null}if(H){try{H.readyState===WebSocket.OPEN&&H.close(1e3,"User ended call")}catch{}H=null}Y&&(clearInterval(Y),Y=null);try{if(I){try{I.close()}catch{}I=null}if(C){try{C.close()}catch{}C=null}if(T){try{T.getTracks().forEach(t=>t.stop())}catch{}T=null}let e=document.getElementById("assistantAudio");e&&(e.srcObject=null),O&&(cancelAnimationFrame(O),O=null);try{P&&P.disconnect()}catch{}P=null;try{R&&R.disconnect()}catch{}if(R=null,M){try{M.close()}catch{}M=null}L!=null&&(clearInterval(L),L=null),X=!1}catch{}Ee=!1,$=!1}catch{}}function Se(){let e=localStorage.getItem("chatbot_session_id");return e||(e="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){let n=Math.random()*16|0;return(t==="x"?n:n&3|8).toString(16)}),localStorage.setItem("chatbot_session_id",e)),e}function N(e,t={}){try{window.dispatchEvent(new CustomEvent("chatbot-call-status",{detail:{status:e,...t}}))}catch{}}var Ie=[],Ce=!1,Be=0;function re(e,t){let n=e.getPage();if(n==="call-welcome"){let o=document.getElementById("call-welcome-back"),c=document.getElementById("call-welcome-start");o&&o.addEventListener("click",()=>e.setPage("welcome")),c&&c.addEventListener("click",()=>e.setPage("precall"));let i=document.getElementById("footer-call"),a=document.getElementById("footer-chat");i&&i.classList.add("active"),a&&a.classList.remove("active"),a&&a.addEventListener("click",()=>e.setPage("prechat"));return}if(n==="precall"){let d=function(){let h=(a&&a.value||"").trim(),k=(p&&p.value||"").trim().length>=7,f=!!(r&&r.checked),b=!!h&&k&&f;c&&(c.disabled=!b)},u=function(h){c&&(c.disabled=!!h);let y=document.querySelector(".precall-card");y&&(y.style.pointerEvents=h?"none":"auto"),y&&(y.style.opacity=h?"0.6":"1")},o=document.getElementById("precall-form"),c=document.getElementById("precall-start"),i=document.getElementById("precall-back"),a=document.getElementById("precall-name"),s=document.getElementById("precall-country"),p=document.getElementById("precall-phone"),r=document.getElementById("precall-consent");j("precall-country","+234"),d(),a&&a.addEventListener("input",d),p&&p.addEventListener("input",d),s&&s.addEventListener("change",d),r&&r.addEventListener("change",d);async function _(){if($)return;$=!0,u(!0);let h=(document.getElementById("precall-name").value||"").trim(),y=document.getElementById("precall-country").value||"",k=(document.getElementById("precall-phone").value||"").trim(),f=localStorage.getItem("chatbot_user_question")||"Start call";try{localStorage.setItem("chatbot_user_name",h),localStorage.setItem("chatbot_user_phone",`${y}${k}`),localStorage.setItem("chatbot_user_question",f)}catch{}let b=t&&t.chatbotID||localStorage.getItem("chatbot_id");if(!b){console.error("Missing chatbotID"),$=!1,u(!1);return}try{let l=await fetch(`${K}/chatbots/call/${encodeURIComponent(b)}/start/`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({user_phone:`${y}${k}`,user_name:h})});if(!l.ok)throw new Error("Call init failed");let m=await l.json();try{let S=m&&(m.call_id||m.conversation_id||m.id);S&&localStorage.setItem("chatbot_conversation_id",String(S))}catch{}let g=t&&t.bot,w=b,x=g&&g.language||localStorage.getItem("chatbot_bot_language")||"English",E=g&&g.voice||localStorage.getItem("chatbot_bot_voice")||"alloy",v=g&&g.welcome_message||localStorage.getItem("chatbot_bot_welcome_message")||"Hello! How can I assist you today?";await new Promise(S=>setTimeout(S,200)),Ae({agentId:w,language:x,voice:E,welcomeMessage:v}),e.setPage("call")}catch(l){console.error("Init call error:",l),N("error",{error:l?.message||"Initialization failed"}),alert("Unable to start call. Please try again.")}finally{$=!1,u(!1)}}o&&o.addEventListener("submit",h=>{h.preventDefault(),!(c&&c.disabled)&&_()}),c&&c.addEventListener("click",h=>{h.preventDefault(),!(c&&c.disabled)&&_()}),i&&i.addEventListener("click",()=>e.setPage("call-welcome"));return}if(n==="call"){let a=function(p){let d=(p.detail||{}).status,u=document.getElementById("call-connecting");u&&(d==="connected"||d==="configured"?u.style.display="none":d==="connecting"&&(u.style.display="block"))},o=document.getElementById("call-back"),c=document.getElementById("call-end"),i=document.getElementById("call-connecting");i&&(i.style.display="block"),window.addEventListener("chatbot-call-status",a);async function s(){try{let r=localStorage.getItem("chatbot_conversation_id");if(r){await fetch(`${K}/chatbots/call/${encodeURIComponent(r)}/complete/`,{method:"POST",headers:{"Content-Type":"application/json"}});try{localStorage.removeItem("chatbot_conversation_id")}catch{}}else{let d=Se();await fetch(`${K}/chatbots/conversations/${encodeURIComponent(d)}/end/`,{method:"POST",headers:{"Content-Type":"application/json"}})}}catch{}W=!0,ce();let p=null;try{p=localStorage.getItem("chatbot_transfer_phone_number")}catch{}p?(e.setPage("postcall-transfer"),console.log()):e.setPage("call-welcome")}A=s,o&&o.addEventListener("click",p=>{p.preventDefault(),s()}),c&&c.addEventListener("click",p=>{p.preventDefault(),s()});return}if(n==="postcall-transfer"){let o=document.getElementById("transfer-call-now"),c=document.getElementById("transfer-close"),i=null;try{i=localStorage.getItem("chatbot_transfer_phone_number")}catch{}o&&o.addEventListener("click",()=>{if(i)try{window.location.href=`tel:${i}`}catch{}try{localStorage.removeItem("chatbot_transfer_phone_number")}catch{}try{document.body.classList.remove("show-chatbot")}catch{}e.setPage("call-welcome")}),c&&c.addEventListener("click",()=>{try{localStorage.removeItem("chatbot_transfer_phone_number")}catch{}try{document.body.classList.remove("show-chatbot")}catch{}e.setPage("call-welcome")});return}}async function Le(e,t,n,o){let c=`${ae}realtime/token`,i=null;try{let r=localStorage.getItem("chatbot_custom_apis"),d=r?JSON.parse(r):null;i=Array.isArray(d)&&d.length>0?d:null}catch{i=null}let a={};e&&(a.agent_id=e),n&&(a.voice=n),t&&(a.language=t),o&&(a.welcome_message=o),i&&(a.custom_apis=i);let s=await fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!s.ok){let r=await s.text();throw new Error(`Failed to obtain token: ${r}`)}let p=await s.json();if(!p.value)throw new Error("Token response missing value field");return p.value}async function Pe(e,t,n){try{let o=JSON.parse(n||"{}");if(o&&o.transfer_phone_number){let a=String(o.transfer_phone_number);try{localStorage.setItem("chatbot_transfer_phone_number",a)}catch{}}let c=await fetch(`${ae}realtime/function-call`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({function_name:e,arguments:o})});if(!c.ok)throw new Error(`Function call failed: ${c.statusText}`);let i=await c.json();if(I&&I.readyState==="open"){let a={type:"conversation.item.create",item:{type:"function_call_output",call_id:t,output:JSON.stringify(i)}};I.send(JSON.stringify(a)),I.send(JSON.stringify({type:"response.create"}))}}catch(o){if(I&&I.readyState==="open"){let c={type:"conversation.item.create",item:{type:"function_call_output",call_id:t,output:JSON.stringify({error:o?.message||"Function call error"})}};I.send(JSON.stringify(c))}}}async function Ae({agentId:e,language:t,voice:n,welcomeMessage:o}){try{let d=function(){X||(X=!0,D=Date.now(),L&&clearInterval(L),L=setInterval(()=>{if(W)return;Date.now()-D>=IDLE_TIMEOUT_MS&&A&&A()},1e3))};N("connecting");let c=document.getElementById("call-connecting");c&&(c.style.display="block");let i=localStorage.getItem("chatbot_id")||e,a=localStorage.getItem("chatbot_bot_voice")||n,s=localStorage.getItem("chatbot_bot_language")||t,p=localStorage.getItem("chatbot_bot_welcome_message")||o,r=await Le(i,s,a,p);C=new RTCPeerConnection({iceServers:[{urls:["stun:stun.l.google.com:19302"]}]}),C.addEventListener("iceconnectionstatechange",()=>{let f=C.iceConnectionState;(f==="disconnected"||f==="failed")&&A&&A()}),T=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1}),T.getTracks().forEach(f=>C.addTrack(f,T)),C.addEventListener("track",f=>{let[b]=f.streams,l=document.getElementById("assistantAudio");l&&(l.srcObject=b);let m=b&&b.getAudioTracks&&b.getAudioTracks()[0];m&&(m.onunmute=()=>{F(),d();let g=document.getElementById("call-connecting");g&&(g.style.display="none"),N("streaming")});try{let g=function(){let w=new Uint8Array(P.frequencyBinCount);P.getByteTimeDomainData(w);let x=0;for(let v=0;v<w.length;v++){let S=(w[v]-128)/128;x+=S*S}Math.sqrt(x/w.length)>.02&&F(),O=requestAnimationFrame(g)};M=new(window.AudioContext||window.webkitAudioContext),R=M.createMediaStreamSource(b),P=M.createAnalyser(),P.fftSize=256,R.connect(P),O=requestAnimationFrame(g)}catch{}}),I=C.createDataChannel("oai-events"),I.onopen=()=>{F(),d();try{I.send(JSON.stringify({type:"response.create"}))}catch{}},I.onmessage=f=>{F(),d();try{let b=JSON.parse(f.data);if(b.type==="response.function_call_arguments.done"){let{name:l,call_id:m,arguments:g}=b;Pe(l,m,g)}}catch{}};let u=await C.createOffer();await C.setLocalDescription(u);let h=await fetch("https://api.openai.com/v1/realtime/calls",{method:"POST",headers:{Authorization:`Bearer ${r}`,"Content-Type":"application/sdp"},body:C.localDescription?.sdp||""});if(!h.ok)throw new Error("SDP exchange failed");let y=await h.text(),k=new RTCSessionDescription({type:"answer",sdp:y});await C.setRemoteDescription(k),L&&clearInterval(L),D=Date.now(),L=setInterval(()=>{if(W)return;Date.now()-D>=1e4&&A&&A()},1e3),N("connected")}catch(c){console.error("LiveCall start error:",c),N("error",{error:c?.message||"RTC start failed"}),ce()}}function ue(e){let t=document.querySelector(".chatbot-toggler"),n=document.querySelector(".chat-actions"),o=t?t.querySelector("i"):null,c=document.querySelector(".pill-btn");function i(){o&&(o.className=n.classList.contains("show")?"bi bi-x-lg":"bi bi-chat-dots")}t&&t.addEventListener("click",()=>{n.classList.toggle("show")||n.classList.remove("show"),i()});let a=document.getElementById("pill-toggle");a&&a.addEventListener("click",()=>{let r=e.getPage();r&&localStorage.setItem("chatbot_prev_page",r),document.body.classList.remove("show-chatbot"),i()}),c&&c.addEventListener("click",r=>{r.preventDefault();try{window.open("https://share-eu1.hsforms.com/2U7ipluaKRqy_okiu5ErdUA2es2nu","_blank","noopener,noreferrer")}catch{window.location.href="https://share-eu1.hsforms.com/2U7ipluaKRqy_okiu5ErdUA2es2nu"}});let s=document.getElementById("action-chat"),p=document.getElementById("action-call");s&&s.addEventListener("click",()=>{n.classList.remove("show"),document.body.classList.add("show-chatbot"),i();let r=localStorage.getItem("chatbot_current_page"),d=localStorage.getItem("chatbot_user_name");e.setPage(r==="chat"||d?"chat":"welcome")}),p&&p.addEventListener("click",()=>{n.classList.remove("show"),document.body.classList.add("show-chatbot"),i(),e.setPage("call-welcome")})}function B(e,t){let n=document.querySelector(".chatbox");if(!n)return;let o=document.createElement("li");if(t==="typing")o.className="chat typing",o.innerHTML='<i class="bi bi-robot"></i><p class="typing"><span></span><span></span><span></span></p>';else{let c=t==="error"?"error":t;o.className=`chat ${c}`,c==="incoming"?o.innerHTML=`<i class="bi bi-robot"></i><div class="bubble">${Te(e)}</div>`:c==="error"?o.innerHTML=`<i class="bi bi-robot"></i><p>${Z(e).replace(/\n/g,"<br>")}</p>`:o.innerHTML=`<p>${Z(e).replace(/\n/g,"<br>")}</p>`}return n.appendChild(o),n.scrollTop=n.scrollHeight,o}function Z(e){return(e||"").replace(/[&<>]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[t])}function Te(e){let n=Z(e||"").split(`
`),o="",c=!1,i=null;function a(){i&&(o+=`</${i}>`,i=null)}function s(p){return p.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>")}for(let p=0;p<n.length;p++){let r=n[p];if(r.trim().startsWith("```")){c?(c=!1,o+="</code></pre>"):(a(),c=!0,o+="<pre><code>");continue}if(c){o+=r+`
`;continue}if(/^###\s+/.test(r)){a(),o+="<h3>"+r.replace(/^###\s+/,"")+"</h3>";continue}if(/^##\s+/.test(r)){a(),o+="<h2>"+r.replace(/^##\s+/,"")+"</h2>";continue}if(/^#\s+/.test(r)){a(),o+="<h1>"+r.replace(/^#\s+/,"")+"</h1>";continue}if(/^\s*\d+\.\s+/.test(r)){let d=r.replace(/^\s*\d+\.\s+/,"");i!=="ol"&&(a(),i="ol",o+="<ol>"),o+="<li>"+s(d)+"</li>";continue}if(/^\s*[-*]\s+/.test(r)){let d=r.replace(/^\s*[-*]\s+/,"");i!=="ul"&&(a(),i="ul",o+="<ul>"),o+="<li>"+s(d)+"</li>";continue}if(r.trim()===""){a();continue}a(),o+="<p>"+s(r)+"</p>"}return a(),o}function me(e){return`chatbot_history_${e||"default"}`}function se(e){try{return JSON.parse(localStorage.getItem(me(e)))||[]}catch{return[]}}function ie(e,t){try{localStorage.setItem(me(e),JSON.stringify(t))}catch{}}function le(e){e.forEach(t=>B(t.text,t.type))}var de="https://api.zentai.cloud/api/v1";function ge(e,t){let n=e.getPage(),o=t&&t.bot,c=t&&t.chatbotID,i=o&&o.welcome_message||"Hello! How can I help you today?";if(n==="welcome"){let a=document.getElementById("start-conversation");a&&a.addEventListener("click",()=>e.setPage("prechat"));let s=document.getElementById("footer-chat");s&&s.addEventListener("click",()=>e.setPage("prechat"));let p=document.getElementById("footer-call");p&&p.addEventListener("click",()=>e.setPage("call-welcome"))}else if(n==="call-welcome"){let a=document.getElementById("call-welcome-back"),s=document.getElementById("call-welcome-start");a&&a.addEventListener("click",()=>e.setPage("welcome")),s&&s.addEventListener("click",()=>e.setPage("precall"));let p=document.getElementById("footer-call"),r=document.getElementById("footer-chat");p&&p.classList.add("active"),r&&r.classList.remove("active"),r&&r.addEventListener("click",()=>e.setPage("prechat"))}else if(n==="prechat"){let h=function(l){return/.+@.+\..+/.test((l||"").trim())},y=function(){let l=(p&&p.value||"").trim(),m=(r&&r.value||"").trim(),g=d&&d.value||"",w=(u&&u.value||"").trim(),x=(_&&_.value||"").trim(),E=w.length>=7,v=!!l&&h(m)&&!!g&&E&&!!x;s&&(s.disabled=!v)},a=document.getElementById("prechat-form");j("country-code","+234");let s=document.getElementById("start-chat-btn"),p=document.getElementById("prechat-name"),r=document.getElementById("prechat-email"),d=document.getElementById("country-code"),u=document.getElementById("prechat-phone"),_=document.getElementById("prechat-question");y(),p&&p.addEventListener("input",y),r&&r.addEventListener("input",y),d&&d.addEventListener("change",y),u&&u.addEventListener("input",y),_&&_.addEventListener("input",y),a&&a.addEventListener("submit",l=>{if(l&&l.preventDefault&&l.preventDefault(),s&&s.disabled)return;let m=(document.getElementById("prechat-name").value||"").trim(),g=(document.getElementById("prechat-email").value||"").trim(),w=document.getElementById("country-code").value||"",x=(document.getElementById("prechat-phone").value||"").trim(),E=(document.getElementById("prechat-question").value||"").trim();localStorage.setItem("chatbot_user_name",m),localStorage.setItem("chatbot_user_email",g),localStorage.setItem("chatbot_user_phone",`${w}${x}`),localStorage.setItem("chatbot_user_question",E),e.setPage("chat")}),s&&s.addEventListener("click",()=>{let l=document.getElementById("prechat-form");s&&s.disabled||l&&l.dispatchEvent(new Event("submit"))});let k=document.getElementById("prechat-back-btn");k&&k.addEventListener("click",()=>e.setPage("welcome"));let f=document.getElementById("footer-chat"),b=document.getElementById("footer-call");f&&f.addEventListener("click",()=>e.setPage("prechat")),b&&b.addEventListener("click",()=>e.setPage("precall")),f&&f.classList.add("active"),b&&b.classList.remove("active")}else if(n==="chat"){let y=function(){let l=localStorage.getItem("chatbot_session_id");return l||(l="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(m){let g=Math.random()*16|0;return(m==="x"?g:g&3|8).toString(16)}),localStorage.setItem("chatbot_session_id",l)),l},k=function(l,m){m!=="error"&&(d.push({text:l,type:m,ts:Date.now()}),ie(c,d))},a=localStorage.getItem("chatbot_user_name")||"Guest",s=localStorage.getItem("chatbot_user_email")||"",p=localStorage.getItem("chatbot_user_phone")||"",r=localStorage.getItem("chatbot_user_question")||"",d=se(c);d.length>0?le(d):B(i,"incoming");let u=document.getElementById("chat-input"),_=document.getElementById("send-btn"),h=document.getElementById("attach-btn");async function f(l){B(l,"outgoing"),k(l,"outgoing");let m=document.querySelector(".chatbox li:last-child");if(m&&m.classList.contains("outgoing")){let x=document.createElement("span");x.className="sender-tag",x.textContent=a||"You",m.appendChild(x)}let g=pe(),w={session_id:y(),message:l,user_email:s,user_name:a,user_phone:p};try{if(!c)throw new Error("Missing chatbotID");let x=await fetch(`${de}/chatbots/widget/${encodeURIComponent(c)}/chat/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(w)}),E=x.ok,v=E?await x.json():null;if(g(),!E)throw new Error("Request failed");let S=v&&v.bot_message&&v.bot_message.message||v?.data?.response||v?.response||v?.message||"Okay.";B(S,"incoming"),k(S,"incoming")}catch{g(),B("Could not process your request at the moment. Please try again.","error")}}r&&d.length===0&&f(r),_&&_.addEventListener("click",()=>{let l=(u&&u.value||"").trim();l&&(u.value="",f(l))}),u&&u.addEventListener("keydown",l=>{if(l.key==="Enter"&&!l.shiftKey){l.preventDefault();let m=(u&&u.value||"").trim();if(!m)return;u.value="",f(m)}}),h&&h.addEventListener("click",()=>{});let b=document.getElementById("chat-back-btn");b&&b.addEventListener("click",()=>e.setPage("prechat"))}else{if(n==="call-welcome"||n==="precall"||n==="call"||n==="postcall-transfer")return re(e,t);if(n==="prechat"){let a=document.getElementById("prechat-form");a&&a.addEventListener("submit",()=>{let u=(document.getElementById("prechat-name").value||"").trim(),_=(document.getElementById("prechat-email").value||"").trim(),h=document.getElementById("country-code").value||"",y=(document.getElementById("prechat-phone").value||"").trim(),k=(document.getElementById("prechat-question").value||"").trim();localStorage.setItem("chatbot_user_name",u),localStorage.setItem("chatbot_user_email",_),localStorage.setItem("chatbot_user_phone",`${h}${y}`),localStorage.setItem("chatbot_user_question",k),e.setPage("chat")});let s=document.getElementById("start-chat-btn");s&&s.addEventListener("click",()=>{let u=document.getElementById("prechat-form");u&&u.dispatchEvent(new Event("submit"))});let p=document.getElementById("prechat-back-btn");p&&p.addEventListener("click",()=>e.setPage("welcome"));let r=document.getElementById("footer-chat"),d=document.getElementById("footer-call");r&&r.addEventListener("click",()=>e.setPage("prechat")),d&&d.addEventListener("click",()=>e.setPage("precall")),r&&r.classList.add("active"),d&&d.classList.remove("active")}else if(n==="chat"){let y=function(){let l=localStorage.getItem("chatbot_session_id");return l||(l="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(m){let g=Math.random()*16|0;return(m==="x"?g:g&3|8).toString(16)}),localStorage.setItem("chatbot_session_id",l)),l},k=function(l,m){m!=="error"&&(d.push({text:l,type:m,ts:Date.now()}),ie(c,d))},a=localStorage.getItem("chatbot_user_name")||"Guest",s=localStorage.getItem("chatbot_user_email")||"",p=localStorage.getItem("chatbot_user_phone")||"",r=localStorage.getItem("chatbot_user_question")||"",d=se(c);d.length>0?le(d):B(i,"incoming");let u=document.getElementById("chat-input"),_=document.getElementById("send-btn"),h=document.getElementById("attach-btn");async function f(l){B(l,"outgoing"),k(l,"outgoing");let m=document.querySelector(".chatbox li:last-child");if(m&&m.classList.contains("outgoing")){let x=document.createElement("span");x.className="sender-tag",x.textContent=a||"You",m.appendChild(x)}let g=pe(),w={session_id:y(),message:l,user_email:s,user_name:a,user_phone:p};try{if(!c)throw new Error("Missing chatbotID");let x=await fetch(`${de}/chatbots/widget/${encodeURIComponent(c)}/chat/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(w)}),E=x.ok,v=E?await x.json():null;if(g(),!E)throw new Error("Request failed");let S=v&&v.bot_message&&v.bot_message.message||v?.data?.response||v?.response||v?.message||"Okay.";B(S,"incoming"),k(S,"incoming")}catch{g(),B("Could not process your request at the moment. Please try again.","error")}}r&&d.length===0&&f(r),_&&_.addEventListener("click",()=>{let l=(u&&u.value||"").trim();l&&(u.value="",f(l))}),u&&u.addEventListener("keydown",l=>{if(l.key==="Enter"&&!l.shiftKey){l.preventDefault();let m=(u&&u.value||"").trim();if(!m)return;u.value="",f(m)}}),h&&h.addEventListener("click",()=>{});let b=document.getElementById("chat-back-btn");b&&b.addEventListener("click",()=>e.setPage("prechat"))}else if(n==="call-welcome"){let a=document.getElementById("call-back"),s=document.getElementById("call-end");a&&a.addEventListener("click",()=>e.setPage("call-welcome")),s&&s.addEventListener("click",()=>e.setPage("call-welcome"))}}}function pe(){let e=B("","typing");return function(){e&&e.parentNode&&e.parentNode.removeChild(e)}}window.addEventListener("chatbot-call-status",e=>{});window.addEventListener("chatbot-call-status",e=>{let t=e?.detail?.status||"",n=document.getElementById("call-end"),o=t==="connecting";n&&(n.classList.toggle("loading",o),n.disabled=o)});var Me="Zentrova",ze="https://api.zentai.cloud/api/v1";function $e(){let e=document.createElement("button");e.className="chatbot-toggler",e.setAttribute("aria-label","Open chat"),e.innerHTML='<i class="bi bi-chat-dots"></i>';let t=document.createElement("div");t.className="chat-actions",t.innerHTML=`
    <button id="action-chat" class="chat-action"><i class="bi bi-chat-dots"></i> Chat</button>
    <button id="action-call" class="chat-action"><i class="bi bi-telephone"></i> Call</button>
  `;let n=document.createElement("div");n.className="powered-pill",n.innerHTML=`
    <span>Powered by <span class="brand">Zentrova</span></span>
    <button class="pill-btn">Create Yours</button>
    <button id="pill-toggle" class="pill-toggle" aria-label="Hide"><i class="bi bi-chevron-down"></i></button>
  `;let o=document.createElement("div");o.className="chatbot",o.innerHTML='<div id="chatbot-content"></div>',document.body.appendChild(e),document.body.appendChild(t),document.body.appendChild(n),document.body.appendChild(o);let c=o.querySelector("#chatbot-content");return{toggle:e,actions:t,pill:n,shell:o,contentRoot:c}}function De(e){let t=document.querySelector(".chatbot-toggler"),n=document.querySelector(".chat-actions"),o=document.querySelector(".chatbot"),c=document.querySelector(".powered-pill"),i=e==="bottom-left"?"unset":"24px",a=e==="bottom-left"?"24px":"unset";[t,n,o,c].forEach(s=>{s&&(s.style.right=i,s.style.left=a)})}async function Ne(e){let t=await fetch(`${ze}/chatbots/widget/${encodeURIComponent(e)}/`,{method:"GET"});if(!t.ok)throw new Error("Failed to load bot configuration");return t.json()}async function Re({agentId:e,position:t,brandColor:n,brandName:o}={}){let c=e;try{let g=localStorage.getItem("chatbot_id");g&&c&&g!==c&&localStorage.clear()}catch{}ee(),te();let i=null;try{i=c?await Ne(c):null}catch{}let a=i&&i.brand_color||n||"#5b2a86",s=i&&i.widget_settings&&i.widget_settings.position||t||"bottom-right",p=!!(i&&i.widget_settings&&i.widget_settings.auto_open),r=i&&(i.name||i.organization_name)||o||Me,d=i&&i.welcome_message||"Hello! How can I help you today?";try{localStorage.setItem("chatbot_id",c||""),localStorage.setItem("chatbot_bot_voice",i&&i.voice||"alloy"),localStorage.setItem("chatbot_bot_language",i&&i.language||"English"),localStorage.setItem("chatbot_bot_welcome_message",d),localStorage.setItem("chatbot_transfer_phone_number",i&&i?.transfer_phone_number||"")}catch{}oe(a);let{toggle:u,actions:_,pill:h,shell:y,contentRoot:k}=$e();De(s);let f=ne(r),b={chatbotID:c,bot:i,brandColor:a,position:s,brandName:r,welcomeMessage:d},l=new q(k,f,()=>ge(l,b));(function(){let w=localStorage.getItem("chatbot_session_id");w||(w="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(x){let E=Math.random()*16|0;return(x==="x"?E:E&3|8).toString(16)}),localStorage.setItem("chatbot_session_id",w))})();let m=localStorage.getItem("chatbot_current_page");m&&(l.currentPage=m),ue(l),l.render()}function fe({agentId:e,position:t="bottom-right",brandColor:n="#5b2a86",brandName:o}={}){Re({agentId:e,position:t,brandColor:n,brandName:o})}var he={init:fe};typeof window<"u"&&(window.ChatbotSDK=he);return _e(Oe);})();
