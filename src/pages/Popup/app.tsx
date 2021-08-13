import React, { useEffect, useState } from 'react';
import useGlobalStore from '../../global-stores';

import { AllRoutesType } from '../../global-stores/route-store';

import LoadingPage from './pages/loading-page';
import LoginPage from './pages/login-page';
import OfflinePage from './pages/offline-page';
import HomePage from './pages/home-page';

const App = () => {
  const [online, setOnline] = useState(window.navigator.onLine);
  const [currentRoute, changeRoute] = useGlobalStore((state: any) => [
    state.currentRoute,
    state.changeRoute,
  ]);

  useEffect(() => {
    // offline --> online ??
    // window.addEventListener('online', () => {
    //   setOnline(true);
    //   changeRoute('LOGIN_ROUTE');
    // });
    window.addEventListener('offline', () => {
      setOnline(false);
      changeRoute('OFFLINE_ROUTE');
    });
  }, []);

  useEffect(() => {
    // if authenticate --> to home route else login route
    changeRoute('LOGIN_ROUTE');
  }, []);

  console.log('currentRoute', currentRoute);
  const ifCurrentRouteIs = (route: AllRoutesType) => currentRoute === route;
  return (
    <>
      {ifCurrentRouteIs('LOADING_ROUTE') && <LoadingPage />}
      {ifCurrentRouteIs('LOGIN_ROUTE') && <LoginPage />}
      {ifCurrentRouteIs('OFFLINE_ROUTE') && <OfflinePage />}
      {ifCurrentRouteIs('HOME_ROUTE') && <HomePage />}
    </>
  );
};

export default App;
