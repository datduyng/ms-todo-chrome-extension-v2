import React from 'react';
import { firstTimeOauth2AndSaveToStore } from '../../../global-stores/auth-store';

const Login = () => {
  return (
    <div>
      <h1>Login page</h1>
      <button
        onClick={() => {
          chrome.windows.create({
            // Just use the full URL if you need to open an external page
            url: chrome.runtime.getURL('popup.html'),
          });
        }}
      >
        New tab
      </button>
      <button
        onClick={() => {
          firstTimeOauth2AndSaveToStore();
        }}
      >
        Sign in with MS
      </button>
    </div>
  );
};

export default Login;
