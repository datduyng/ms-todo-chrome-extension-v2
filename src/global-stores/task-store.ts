import { SetState, GetState } from 'zustand';
import { TaskFolderType } from 'types/ms-todo';

import { getTaskFolders, getMe } from '../pages/Popup/helpers/msTodoRestApi';

import useGlobalStore from '../global-stores';

export type TaskStoreType = {
  taskFolders: TaskFolderType[];
  fetchTaskFolders: () => Promise<any>;
};

export const routeStore = (
  set: SetState<TaskStoreType>,
  get: GetState<TaskStoreType>
) => ({
  taskFolders: [],

  fetchTaskFolders: async () => {
    const userAuthToken = useGlobalStore.getState().userAuthToken;
    console.log('userAuthToken', userAuthToken);
    const taskFolders = await getTaskFolders(userAuthToken);
    const me = await getMe(userAuthToken);
    console.log('me', me);
    console.log('taskFolders', taskFolders);
    set({
      taskFolders: taskFolders.value,
    });
  },
});

export default routeStore;
