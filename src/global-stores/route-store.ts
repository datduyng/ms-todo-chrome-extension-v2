import { SetState, GetState } from 'zustand';

export type AllRoutesType =
  | 'LOADING_ROUTE'
  | 'LOGIN_ROUTE'
  | 'HOME_ROUTE'
  | 'OFFLINE_ROUTE';

const DEFAULT_ROUTE: AllRoutesType = 'LOADING_ROUTE';

if (!(window as any).SLANTED_LAB_DEBUG) {
  (window as any).SLANTED_LAB_DEBUG = {
    AUTH: {},
    routeHistory: [],
  };
}

export type RouteStoreType = {
  currentRoute: string;
  changeRoute: (route: AllRoutesType) => void;
};

export const routeStore = (
  set: SetState<RouteStoreType>,
  get: GetState<RouteStoreType>
) => ({
  currentRoute: DEFAULT_ROUTE,
  pageProps: {},
  changeRoute: (route: AllRoutesType) => {
    (window as any).SLANTED_LAB_DEBUG.routeHistory.push(route);
    set(() => ({
      currentRoute: route,
    }));
  },
});

export default routeStore;
