import { timeStamp } from 'console';
import { create as createPKCE } from 'pkce';
import { SetState, GetState } from 'zustand';

const MS_AUTH_KEY = 'ms-auth-storage';
let localStorage =
  chrome.extension.getBackgroundPage()?.localStorage || window.localStorage;

if (!(window as any).SLANTED_LAB_DEBUG) {
  (window as any).SLANTED_LAB_DEBUG = {
    AUTH: {},
    routeHistory: [],
    ZUSTAND: {},
  };
}

type MSOauth2BearerType = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

type UserBearerType = {
  version: string;
  access_token: string | undefined;
  refresh_token: string | undefined;
  expires_in: number | undefined;
  expires_at: number | undefined;
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
            .then((data: MSOauth2BearerType) => {
              console.log('data resolves', data);
              setUserBeaer(data);
              resolve();
            })
            .catch((e) => reject(e));
        }
      );
    }
  ).catch(async (e) => {
    console.error('some error', e); // todo
    // await clearStorage();
  });
}

function refreshToken(refresh_token: string): Promise<MSOauth2BearerType> {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      client_id: clientID,
      scope,
      refresh_token,
      grant_type: 'refresh_token',
      redirect_uri
    } as any).toString();
    fetch(`${oauthURL}/token`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      credentials: 'omit',
      body,
    })
      .then((data) => data.json())
      .then((data: MSOauth2BearerType) => {
        console.log('refresh token data', data);
        resolve(data);
      })
      .catch(async (err) => {
        console.error('error when refreshing token', err); // todo.s
      });
  });
}

function timestamp() {
  return Math.round(Date.now() / 1000);
}

const init = async () => {
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

const getUserBearer = () => {
  return JSON.parse(localStorage[MS_AUTH_KEY] || '{}') as UserBearerType | null;
};

const setUserBeaer = (data: MSOauth2BearerType | null) => {
  localStorage[MS_AUTH_KEY] =
    data != null
      ? JSON.stringify({
          version: initState.version,
          access_token: data.access_token,
          expires_in: data.expires_in,
          refresh_token: data.refresh_token,
          expires_at: timestamp() + data.expires_in,
        })
      : null;
};

function isExpired(expiredAt: number | undefined) {
  if (!expiredAt) {
    return true;
  }
  const TOKEN_EXPIRATION_OFFSET = 30;
  return expiredAt < timestamp() + TOKEN_EXPIRATION_OFFSET;
}

export type AuthStoreType = {
  authenticated: boolean;
  ensureAuthenticatedAsync: () => Promise<string>;
  userAuthToken: string;
  logOut: () => void;
  
};

const authStore = (
  set: SetState<AuthStoreType>,
  get: GetState<AuthStoreType>
) => ({
  userAuthToken: '',
  ensureAuthenticatedAsync: async (): Promise<string> => {
    const userBearer = getUserBearer();
    if (userBearer && userBearer.access_token) {
      let access_token = userBearer.access_token;
      if (isExpired(userBearer.expires_at)) {
        // refresh token
        const bearer = await refreshToken(userBearer.refresh_token || '');
        access_token = bearer.access_token;
        setUserBeaer(bearer);
      }
      set({
        authenticated: true,
        userAuthToken: access_token,
      });
      return access_token;
    }

    set({
      authenticated: false,
      userAuthToken: '',
    });
    // run first time oauth flow??
    return '';
  },
  logOut: () => {
    setUserBeaer(null);
    set({
      authenticated: false,
      userAuthToken: '',
    });
  }
});

(window as any).SLANTED_LAB_DEBUG.AUTH = {
  firstTimeOauth2AndSaveToStore,
  refreshToken,
};

export default authStore;
