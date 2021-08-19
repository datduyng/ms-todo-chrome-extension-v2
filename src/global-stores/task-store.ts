import { SetState, GetState } from 'zustand';
import { TaskFolderType } from 'types/ms-todo';

import { getTaskFolders, getMe } from '../pages/Popup/helpers/msTodoRestApi';

import useGlobalStore from '../global-stores';

export type TaskStoreType = {
  taskFolderDict: { [id: string]: TaskFolderType };
  taskFolders: () => TaskFolderType[];
  fetchTaskFolders: () => Promise<any>;
  selectedFolderId: string | null;
  updateSelectedFolder: (selectedFolderId: string | null) => void;
};

export const routeStore = (
  set: SetState<TaskStoreType>,
  get: GetState<TaskStoreType>
) => ({
  taskFolderDict: {},
  selectedFolderId: null,
  taskFolders: () => {
    const globalStore = useGlobalStore.getState();
    return Object.values(globalStore.taskFolderDict);
  },
  updateSelectedFolder: (selectedFolderId: string | null) => {
    set({
      selectedFolderId
    })
  },
  fetchTaskFolders: async () => {
    const globalStore = useGlobalStore.getState();
    console.log('gloabalState',globalStore);
    await globalStore.ensureAuthenticatedAsync();
    const userAuthToken = globalStore.userAuthToken;
    console.log('userAuthToken', userAuthToken);
    const taskFolders = await getTaskFolders(userAuthToken);
    const me = await getMe(userAuthToken);
    console.log('me', me);
    console.log('taskFolders()', taskFolders);
    const taskFolderDict = globalStore.taskFolderDict;
    for (let taskFolder of taskFolders.value) {
      taskFolderDict[taskFolder.id] = taskFolder;
      if (taskFolder.isDefaultFolder && !globalStore.selectedFolderId) {
        set({
          selectedFolderId: taskFolder.id
        })
      }
    }
    set({
      taskFolderDict: {
        ...taskFolderDict
      },
    });
  },
});

export default routeStore;
