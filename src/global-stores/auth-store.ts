import { create as createPKCE } from 'pkce';

const MS_AUTH_KEY = 'ms-auth-storage';
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

// console.log('env', process.env);
const client_secret = process.env.CLIENT_SECRET;
const oauthURL = 'https://login.microsoftonline.com/common/oauth2/v2.0';
const clientID = process.env.CLIENT_ID;
const redirect_uri = chrome.identity.getRedirectURL();
console.log('redirect_uri', redirect_uri);
const scope = ['https://graph.microsoft.com/.default', 'offline_access'].join(
  ' '
);

export function firstTimeOauth2AndSaveToStore() {
  const { codeVerifier, codeChallenge } = createPKCE();
  const state = 'random'; // avoid cross browser attack
  const urlParams = new URLSearchParams({
    client_id: clientID,
    response_type: 'code',
    redirect_uri: redirect_uri,
    response_mode: 'query',
    scope: scope,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  } as any).toString();
  const authURL = `${oauthURL}/authorize?${urlParams}`;
  return new Promise(
    (resolve: (value?: any) => void, reject: (value: any) => void) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: authURL,
          interactive: true,
        },
        (responseUrl: string | undefined) => {
          if (chrome?.runtime?.lastError) {
            reject(chrome.runtime.lastError.message);
          }
          console.log('responseUrl', responseUrl);
          let resParams = new URLSearchParams(
            new URL(responseUrl || '').search
          );
          let code = resParams.get('code'),
            responseState = resParams.get('state');
          if (responseState !== state) {
            reject('Cross-site request forgery attack detected.');
          }
          fetch(`${oauthURL}/token`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: clientID,
              code: code,
              scope: scope,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code',
              code_verifier: codeVerifier,
            } as any).toString(),
          })
            .then((data) => data.json())
            .then((data) => {
              console.log('data resolves', data);
              resolve();
            })
            .catch((e) => reject(e));
        }
      );
    }
  ).catch(async (e) => {
    // await clearStorage();
  });
}

export const init = async () => {
  try {
    if (
      !localStorage[MS_AUTH_KEY] ||
      JSON.parse(localStorage[MS_AUTH_KEY]).version !== initState.version
    ) {
      localStorage[MS_AUTH_KEY] = JSON.stringify(initState);
    }
  } catch (e) {
    console.error('error on setting up auth store', e);
    localStorage[MS_AUTH_KEY] = JSON.stringify(initState);
  }
  return localStorage[MS_AUTH_KEY];
};

init();

export const get = () => {
  return JSON.parse(localStorage[MS_AUTH_KEY] || '{}') as AuthStore;
};

export const set = (newState: AuthStore) => {
  localStorage[MS_AUTH_KEY] = JSON.stringify(newState);
};
