// External font links + full CSS injection and brand application
export function importStyleLink(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}
export function importFonts() {
  importStyleLink('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css');
  importStyleLink('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');
}
// injectStyles(): stop injecting wave + status bar CSS; circle animation remains
export function injectStyles() {
  const css = `
    :root { --brand: #5b2a86; --bg: #ffffff; --text: #1f2937; --muted: #6b7280; --bot-bg: #eef2f7; --user-bg: #eef2ff; --radius: 12px; --radius-lg: 18px; --s-1: 8px; --s-2: 12px; --s-3: 16px; --shadow-1: 0 8px 24px rgba(0, 0, 0, 0.08); --shadow-2: 0 10px 24px rgba(0, 0, 0, 0.12); }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
    .chatbot-toggler { position: fixed; right: 24px; bottom: 30px; height: 56px; width: 56px; border-radius: 50%; border: none; outline: none; cursor: pointer; background: var(--brand); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-2); z-index: 999; transition: transform 0.25s ease; }
    .chatbot-toggler i { font-size: 1.25rem; }
    .chat-actions { position: fixed; right: 24px; bottom: 90px; display: none; flex-direction: column; gap: 12px; z-index: 999; filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12)); }
    .chat-actions.show { display: flex; }
    .show-chatbot .chat-actions { display: none !important; }
    .show-chatbot .chatbot-toggler { display: none; }
    .icon-btn { background: transparent; border: none; color: #fff; font-size: 20px; padding: 4px 8px; cursor: pointer; }
    .powered-pill { position: fixed; right: 24px; bottom: 20px; display: none; align-items: center; gap: 8px; background: #fff; color: #111; border-radius: 999px; box-shadow: var(--shadow-1); padding: 6px 10px; z-index: 999; }
    .powered-pill .brand { font-weight: 700; color: var(--brand); font-size: 0.725rem; }
    .powered-pill span { font-weight: 500; font-size: 0.725rem; }
    .powered-pill .pill-btn { background: var(--brand); color: #fff; border: none; padding: 6px 10px; border-radius: 32px; cursor: pointer; font-size: 12px; }
    .powered-pill .pill-toggle { background: var(--brand); color: #fff; width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .show-chatbot .powered-pill { display: flex; }
    .chat-action { background: var(--brand); color: #fff; border-radius: 12px; padding: 12px 16px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; }
    .chatbot { width: 420px; position: fixed; right: 24px; bottom: 80px; background: var(--bg); border-radius: var(--radius-lg); box-shadow: var(--shadow-2); overflow: hidden; transform: scale(0.5); opacity: 0; pointer-events: none; transition: all 0.25s ease; z-index: 999; }
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
    .welcome-header { color: #fff; margin-bottom: 20px; }
    .welcome-main { padding: var(--s-3); }
    .welcome-header h2 { color: #fff; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .welcome-header p { color: #d6cce8; font-size: 0.835rem; max-width: 70%; }
    .start-conversation-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; background: #fff; color: var(--text); border: none; border-radius: 18px; padding: 16px 18px; box-shadow: var(--shadow-1); cursor: pointer; }
    .start-conversation-btn .title { font-weight: 700; font-size: 16px; }
    .start-conversation-btn .subtitle { font-size: 12px; color: var(--muted); margin-top: 4px; }
    .start-conversation-btn .cta-arrow { color: var(--brand); font-size: 24px; }
    .welcome-footer { background: #fff; border-top: 1px solid #e5e7eb; padding: 14px 32px; border-radius: 0 0 var(--radius-lg) var(--radius-lg); display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
    .welcome-footer .footer-action { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #6b7280; font-weight: 500; background: transparent; border: none; cursor: pointer; font-size: 0.75rem; }
    .welcome-footer .footer-action i { font-size: 14px; color: #6b7280; }
    .prechat-main { padding: var(--s-3); }
    .prechat-intro { color: #d6cce8; font-size: 0.875rem; max-width: 80%; margin: 8px 0 12px; }
    .prechat-card, .precall-card { background: #fff; border-radius: 18px; padding: var(--s-3); box-shadow: var(--shadow-1); color: var(--text); }
    .prechat-start-btn { display: flex; align-items: center; gap: 8px; background: var(--brand); color: #fff; border: none; border-radius: 999px; padding: 10px 14px; font-weight: 700; cursor: pointer; width: max-content; font-size: 0.75rem; }
    .prechat-start-btn i { font-size: 14px; }
    .prechat-start-btn span { font-size: 0.875rem; }
    .welcome-footer .footer-action.active { color: var(--brand); }
    .welcome-footer .footer-action.active i { color: var(--brand); }
    .prechat-form { display: flex; flex-direction: column; gap: 10px; padding: var(--s-1); }
    .prechat-form label { font-size: 12px; color: var(--muted); }
    .prechat-form input, .prechat-form select, .prechat-form textarea { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 14px; outline: none; background: #fff; }
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
.prechat-form-head{font-size: 0.75rem; font-weight: 300; color: var(--muted);}
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
  // NEW: RTC audio indicator styling
  const rtcAudioCss = `
    .audio-indicator { display: none; justify-content: center; align-items: center; gap: 8px; padding: 16px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border-radius: 12px; }
    .audio-indicator.active { display: flex; }
    .audio-indicator span { width: 6px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); animation: aiPulse 1s ease-in-out infinite; }
    .audio-indicator span:nth-child(2) { animation-delay: 0.15s; }
    .audio-indicator span:nth-child(3) { animation-delay: 0.3s; }
    .audio-indicator span:nth-child(4) { animation-delay: 0.45s; }
    @keyframes aiPulse { 0%, 100% { height: 12px; } 50% { height: 32px; } }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  // Only inject base css; omit callStatusCss & rtcAudioCss
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}
export function applyBrand(brandColor) {
  if (brandColor) document.documentElement.style.setProperty('--brand', brandColor);
}