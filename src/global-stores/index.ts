import { unstable_batchedUpdates } from 'react-dom';
import createStore, { SetState, GetState } from 'zustand';
import { devtools, persist, StateStorage } from 'zustand/middleware';

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

type GlobalStore = BaseStore & TestStore;

const testStore = (set: SetState<TestStore>, get: GetState<TestStore>) => ({
  todos: ['todo 1 ', 'todo 2'],
  addTodo: (todo: string) => {
    const { todos } = get();
    set({
      todos: [...todos, todo],
    });
  },
});

const states = combineStateCreators(baseStore, testStore);

const backgroundWindow = chrome.extension.getBackgroundPage();

let store = createStore<GlobalStore>(
  devtools<any>(
    persist(states, {
      name: 'slanted-lab-ms-todo',
      getStorage: () =>
        (backgroundWindow?.localStorage as StateStorage) || undefined,
    })
  )
);

store.subscribe(console.debug);

export default store;
