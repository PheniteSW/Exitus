const CHAT_HISTORY_KEY = 'exitus_chat_history';
const CHAT_COUNT_KEY = 'exitus_chat_count';
const CHAT_DATE_KEY = 'exitus_chat_date';
const SUBSCRIPTION_KEY = 'exitus_subscription';
const USER_PROFILE_KEY = 'exitus_user_profile';

export const FREE_DAILY_LIMIT = 5;

export function getChatHistory() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveChatHistory(messages) {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
}

export function clearChatHistory() {
  localStorage.removeItem(CHAT_HISTORY_KEY);
}

export function getDailyCount() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(CHAT_DATE_KEY);
  if (savedDate !== today) {
    localStorage.setItem(CHAT_DATE_KEY, today);
    localStorage.setItem(CHAT_COUNT_KEY, '0');
    return 0;
  }
  return parseInt(localStorage.getItem(CHAT_COUNT_KEY) || '0', 10);
}

export function incrementDailyCount() {
  const today = new Date().toDateString();
  localStorage.setItem(CHAT_DATE_KEY, today);
  const count = getDailyCount() + 1;
  localStorage.setItem(CHAT_COUNT_KEY, String(count));
  return count;
}

export function getSubscription() {
  try {
    return JSON.parse(localStorage.getItem(SUBSCRIPTION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveSubscription(sub) {
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub));
}

export function clearSubscription() {
  localStorage.removeItem(SUBSCRIPTION_KEY);
}

export function isPro() {
  const sub = getSubscription();
  if (!sub) return false;
  if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) {
    clearSubscription();
    return false;
  }
  return sub.active === true;
}

export function getUserProfile() {
  try {
    return JSON.parse(localStorage.getItem(USER_PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveUserProfile(profile) {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}
