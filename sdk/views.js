// All view templates (match chatbot.html)
// getRoutes() – call view: remove wave indicator, keep circle only
export function getRoutes(name = 'Zentrova') {
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
                  <option value="+234">🇳🇬 +234</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
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
          ${name}
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
          <button id="call-back" class="icon-btn" aria-label="Back">‹</button>
          <span>Calling...</span>
        </div>
        <div class="call-card" style="border-radius:0">
          <p style="text-align:center; color: var(--muted); margin: 0 0 6px;">Talking to</p>
          <h2 style="text-align:center; font-size: 24px; font-weight: 800; margin: 0 0 8px;">${name} </h2>
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
    `,
    'call-welcome': () => `
      <div class="welcome-screen call-welcome">
        <div class="chat-header call-wellcome-h">
          <button id="call-welcome-back" class="icon-btn" aria-label="Back">‹</button>
          <span>Call (${name})</span>
        </div>
        <div class="call-welcome-card" style="margin: var(--s-2);">
          <p style="text-align:center; font-size:0.75rem;color:\"#eeeeee\";margin-bottom:4px;">Talk to</p>
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
          <button id="precall-back" class="icon-btn" aria-label="Back">‹</button>
          <span>Call (${name})</span>
        </div>
        <div class="precall-card" style="margin: var(--s-2);">
          <p class="prechat-intro">Hi, Welcome to (${name}). Let us know you and how we may help you?</p>
          <form id="precall-form" class="prechat-form" onsubmit="return false;">
            <input id="precall-name" type="text" placeholder="Name" />
           
            <div class="country-row">
              <select id="precall-country">
                <option value="+234">🇳🇬 +234</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
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
    `,
    "postcall-transfer": () => `
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
    `,
  };
}