import createStore, { SetState, GetState } from 'zustand';
import { devtools, persist, StateStorage } from 'zustand/middleware';
import RouteStore, { RouteStoreType } from './route-store';
import AuthStore, { AuthStoreType } from './auth-store';
import TaskStore, { TaskStoreType } from './task-store';

type BaseStore = {
  version: string;
};

const baseStore = (set: SetState<BaseStore>, get: GetState<BaseStore>) => ({
  version: '0.0.0',
});

export const combineStateCreators =
  (...stateCreators: any) =>
  (set: any, get: any, api: any) => {
    let values = {};

    stateCreators.forEach((sc: any) => {
      values = Object.assign({}, values, sc(set, get, api));
    });
    return values;
  };

type TestStore = {
  todos: string[];
  addTodo: () => void;
};

type GlobalStoreType = BaseStore &
  TestStore &
  RouteStoreType &
  AuthStoreType &
  TaskStoreType;

const testStore = (set: SetState<TestStore>, get: GetState<TestStore>) => ({
  todos: ['todo 1 ', 'todo 2'],
  addTodo: (todo: string) => {
    const { todos } = get();
    set({
      todos: [...todos, todo],
    });
  },
});

const states = combineStateCreators(
  baseStore,
  testStore,
  RouteStore,
  AuthStore,
  TaskStore
);

const backgroundWindow = chrome.extension.getBackgroundPage();

let store = createStore<GlobalStoreType>(
  devtools<any>(
    persist(states, {
      name: 'slanted-lab-ms-todo',
      getStorage: () =>
        (backgroundWindow?.localStorage as StateStorage) || undefined,
    })
  )
);

store.subscribe(console.debug);
(window as any).ZUSTAND = store;

export default store;
