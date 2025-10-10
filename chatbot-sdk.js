// Chatbot SDK: full conversion of chatbot.html into a reusable module
// Props: { agentId, position, brandColor, brandName }
import { importFonts, injectStyles, applyBrand } from './sdk/styles.js';
import { Router } from './sdk/router.js';
import { getRoutes } from './sdk/views.js';
import { wireShellEvents, bindViewEvents } from './sdk/events.js';

const DEFAULT_BRAND = 'Zentrova';
const BASE_URL = 'https://zentrova-ai.mygrantgenie.com/api/v1';

// Inject shell elements required by events and router
function createShell() {
  // Toggler
  const toggle = document.createElement('button');
  toggle.className = 'chatbot-toggler';
  toggle.setAttribute('aria-label', 'Open chat');
  toggle.innerHTML = '<i class="bi bi-chat-dots"></i>';

  // Quick actions
  const actions = document.createElement('div');
  actions.className = 'chat-actions';
  actions.innerHTML = `
    <button id="action-chat" class="chat-action"><i class="bi bi-chat-dots"></i> Chat</button>
    <button id="action-call" class="chat-action"><i class="bi bi-telephone"></i> Call</button>
  `;

  // Powered pill (visible when shell is open)
  const pill = document.createElement('div');
  pill.className = 'powered-pill';
  pill.innerHTML = `
    <span>Powered by <span class="brand">Zentrova</span></span>
    <button class="pill-btn">Create Yours</button>
    <button id="pill-toggle" class="pill-toggle" aria-label="Hide"><i class="bi bi-chevron-down"></i></button>
  `;

  // Chatbot shell
  const shell = document.createElement('div');
  shell.className = 'chatbot';
  shell.innerHTML = '<div id="chatbot-content"></div>';

  document.body.appendChild(toggle);
  document.body.appendChild(actions);
  document.body.appendChild(pill);
  document.body.appendChild(shell);

  const contentRoot = shell.querySelector('#chatbot-content');
  return { toggle, actions, pill, shell, contentRoot };
}

// Positioning to support bottom-right and bottom-left
function applyPosition(position) {
  const toggle = document.querySelector('.chatbot-toggler');
  const actions = document.querySelector('.chat-actions');
  const shell = document.querySelector('.chatbot');
  const pill = document.querySelector('.powered-pill');
  const right = position === 'bottom-left' ? 'unset' : '24px';
  const left = position === 'bottom-left' ? '24px' : 'unset';
  [toggle, actions, shell, pill].forEach((el) => { if (!el) return; el.style.right = right; el.style.left = left; });
}

// Fetch bot details by chatbotID
async function fetchBotDetails(chatbotID) {
  const res = await fetch(`${BASE_URL}/chatbots/widget/${encodeURIComponent(chatbotID)}/`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to load bot configuration');
  return res.json();
}

// Bootstrap SDK: now async to pull backend config
async function createSDK({ agentId, position, brandColor, brandName } = {}) {
  const chatbotID = agentId; // map SDK param to backend path

  importFonts();
  injectStyles();

  // Try to get bot config from backend, fall back to provided props
  let bot = null;
  try { bot = chatbotID ? await fetchBotDetails(chatbotID) : null; } catch (e) { /* leave bot null and continue */ }

  const effectiveBrand = (bot && bot.brand_color) || brandColor || '#5b2a86';
  const effectivePosition = (bot && bot.widget_settings && bot.widget_settings.position) || position || 'bottom-right';
  const autoOpen = !!(bot && bot.widget_settings && bot.widget_settings.auto_open);
  const name = (bot && (bot.name || bot.organization_name)) || brandName || DEFAULT_BRAND;
  const welcomeMessage = (bot && bot.welcome_message) || "Hello! How can I help you today?";

  applyBrand(effectiveBrand);
  const { toggle, actions, pill, shell, contentRoot } = createShell();
  applyPosition(effectivePosition);

  const routes = getRoutes(name);
  const ctx = { chatbotID, bot, brandColor: effectiveBrand, position: effectivePosition, brandName: name, welcomeMessage };
  const router = new Router(contentRoot, routes, () => bindViewEvents(router, ctx));

  // Seed persistent session id if missing
  (function ensureSessionId() {
    let sid = localStorage.getItem('chatbot_session_id');
    if (!sid) {
      sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8; return v.toString(16);
      });
      localStorage.setItem('chatbot_session_id', sid);
    }
  })();

  // Restore last page if available
  const storedPage = localStorage.getItem('chatbot_current_page');
  if (storedPage) router.currentPage = storedPage;

  wireShellEvents(router);

  router.render();
}

export function init({ agentId, position = 'bottom-right', brandColor = '#5b2a86', brandName } = {}) {
  // fire and forget (async init)
  createSDK({ agentId, position, brandColor, brandName });
}

export const ChatbotSDK = { init };
if (typeof window !== 'undefined') window.ChatbotSDK = ChatbotSDK;