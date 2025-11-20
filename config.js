export const config = (() => {
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const appEnv = String(env.APP_ENV || 'prod').toLowerCase();
console.log("env",appEnv)
  const baseUrl =
    appEnv === 'dev'
      ? (env.API_BASE_DEV_URL || env.API_BASE_URL || 'https://zentrova-ai.mygrantgenie.com/api/v1')
      : appEnv === 'staging'
      ? (env.API_BASE_URL || 'https://zentrova-ai.mygrantgenie.com/api/v1')
      : (env.API_BASE_PROD_URL || env.API_BASE_URL || 'https://zentrova-ai.mygrantgenie.com/api/v1');

  const chatbotBaseUrl =
    appEnv === 'staging'
      ? (env.API_CHATBOT_BASE_URL || 'https://chatbot-staging.zentai.cloud/')
      : (env.API_CHATBOT_BASE_PROD_URL || env.API_CHATBOT_BASE_URL || 'https://zentrova-chatbot.mygrantgenie.com/');

  return { baseUrl, chatbotBaseUrl };
})();