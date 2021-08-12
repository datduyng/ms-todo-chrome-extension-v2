const key = 'ms-auth-storage';

let localStorage =
  chrome.extension.getBackgroundPage()?.localStorage || window.localStorage;

type AuthStore = {
  version: string;
  access_token: string | undefined;
  refresh_token: string | undefined;
  expires_in: number | undefined;
  expires_at: Date | undefined;
};

const initState = { version: '0.0.0' };

export const init = async () => {
  localStorage[key] = JSON.stringify(initState);
  return localStorage[key];
};

try {
  if (
    !localStorage[key] ||
    JSON.parse(localStorage[key]).version !== initState.version
  ) {
    init();
  }
} catch (e) {
  console.error('error on setting up auth store', e);
  init();
}

export const get = () => {
  return JSON.parse(localStorage[key] || '{}') as AuthStore;
};

export const set = (newState: AuthStore) => {
  localStorage[key] = JSON.stringify(newState);
};
