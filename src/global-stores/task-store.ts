import { SetState, GetState } from 'zustand';
import { TaskFolderType, ErrorResponse } from 'types/ms-todo';

import { getTaskFolders, getMe, deleteTaskFolder, updateTaskFolder, createTaskFolder } from '../pages/Popup/helpers/msTodoRestApi';

import useGlobalStore from '../global-stores';

export type TaskStoreType = {
  taskFolderDict: { [id: string]: TaskFolderType };
  taskFolders: () => TaskFolderType[];
  fetchTaskFolders: () => Promise<any>;
  selectedFolderId: string | null;
  selectedFolderInfo: () => TaskFolderType | null;
  updateSelectedFolder: (selectedFolderId: string | null) => void;
  renameTaskFolder: (folderId: string, newName: string) => Promise<any>;
  deleteTaskFolder: (folderId: string) => Promise<any>;
  createTaskFolder: (folderName: string) => Promise<TaskFolderType & ErrorResponse>;
};

export const routeStore = (
  set: SetState<TaskStoreType>,
  get: GetState<TaskStoreType>
) => ({
  taskFolderDict: {},
  selectedFolderId: null,
  selectedFolderInfo: () => {
    const globalStore = useGlobalStore.getState();
    if (!globalStore.selectedFolderId) return null;
    return globalStore.taskFolderDict[globalStore.selectedFolderId];
  },
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
    const userAuthToken = await globalStore.ensureAuthenticatedAsync();
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
  renameTaskFolder: async (folderId: string, newName: string) => {
    const globalStore = useGlobalStore.getState();
    const taskFolderDict = globalStore.taskFolderDict;
    const originalFolder = taskFolderDict[folderId];
    if (!originalFolder) {
      console.error('internal error null originalFolder');
      return null;
    }
    if (originalFolder.name == newName) {
      console.log('renameTaskFolder: Nothing to be updated')
      return null;
    }
    const userAuthToken = await globalStore.ensureAuthenticatedAsync();
    const result = await updateTaskFolder(userAuthToken, folderId, newName);
    if (result.error) {
      return result;
    }
    taskFolderDict[folderId] = result;
    set({
      taskFolderDict: {
        ...taskFolderDict
      }
    });
  },
  deleteTaskFolder: async (folderId: string) => {
    const globalStore = useGlobalStore.getState();
    const userAuthToken = await globalStore.ensureAuthenticatedAsync();
    const result = await deleteTaskFolder(userAuthToken, folderId);
    if (result && result.error) {
      return result;
    }
    const taskFolderDict = globalStore.taskFolderDict;
    delete taskFolderDict[folderId];
    console.log('taskFolderDict delete', taskFolderDict);
    set({
      taskFolderDict: {
        ...taskFolderDict
      }
    });
  },
  createTaskFolder: async (folderName: string) => {
    if (!folderName) return;
    const globalStore = useGlobalStore.getState();
    const userAuthToken = await globalStore.ensureAuthenticatedAsync();
    const result = await createTaskFolder(userAuthToken, folderName);
    if (result && result.error) {
      return result;
    }

    const taskFolderDict = globalStore.taskFolderDict;

    taskFolderDict[result.id] = result as TaskFolderType;
    set({
      taskFolderDict: {
        ...taskFolderDict
      }
    });
  }
});

export default routeStore;
