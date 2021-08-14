import React from 'react';
import { firstTimeOauth2AndSaveToStore } from '../../../global-stores/auth-store';
import microsoftLoginImage from "../../../assets/img/ms-symbollockup_signin_light_short.png"
import './login-page.css'

const Login = () => {
  return (
    <div>
      <h1 id="header">Login page</h1>
      <button id="newtab"
        onClick={() => {
          chrome.windows.create({
            // Just use the full URL if you need to open an external page
            url: chrome.runtime.getURL('popup.html'),
          });
        }}
      >
        New tab
      </button>

      <div id="login">
        <img src={microsoftLoginImage} alt="MSFT Login" width="104" height="41" onClick={() => {
          firstTimeOauth2AndSaveToStore();
        }}></img>
      </div>

    </div>
  );
};

export default Login;
