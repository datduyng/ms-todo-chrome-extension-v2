import { SetState, GetState } from 'zustand';
import { TaskFolderType, TaskType, ErrorResponse, UpdateTaskInputType } from 'types/ms-todo';

import { getTaskFolders, getMe, deleteTaskFolder, updateTaskFolder, createTaskFolder, getTasksFromFolder, updateTask, createTaskInFolder } from '../pages/Popup/helpers/msTodoRestApi';

import useGlobalStore from '../global-stores';
import { WiCloudRefresh } from 'react-icons/wi';

const GROUP_FILTERS = {
  TODAY_TASK: 'Today',
  SCHEDULED_TASK: 'Scheduled',
  IMPORTANT_TASK: 'Important',  
} as any;

export type TaskStoreType = {
  taskFolderDict: { [id: string]: TaskFolderType };
  taskDict: { [id: string]: TaskType };
  defaultSelectedFolderId: string | null;
  selectedFolderId: string | null;
  selectedTaskId: string | null;
  savingTaskStatus: boolean;
  cloudRefreshStatus: boolean;
  taskFolders: () => TaskFolderType[];
  tasksFromFolder: () => TaskType[];
  fetchTaskFolders: () => Promise<any>;
  selectedFolderInfo: () => TaskFolderType | null;
  selectedTaskInfo: () => TaskType | null;
  selectFolder: (selectedFolderId: string | null) => void;
  selectTask: (selectedTaskId: string | null) => void;
  renameTaskFolder: (folderId: string, newName: string) => Promise<any>;
  deleteTaskFolder: (folderId: string) => Promise<any>;
  createTaskFolder: (folderName: string) => Promise<TaskFolderType & ErrorResponse>;
  getTasksFromFolder: (folderId: string) => TaskType[];
  updateTaskById: (taskId: string, updateTaskInputType: UpdateTaskInputType) => Promise<TaskType & ErrorResponse>;
  createTaskInFolder: (taskName: string, folderId: string) => Promise<TaskType & ErrorResponse>;
  cloudRefresh: () => Promise<any>;
};

export const routeStore = (
  set: SetState<TaskStoreType>,
  get: GetState<TaskStoreType>
) => ({
  taskFolderDict: {},
  taskDict: {},
  defaultSelectedFolderId: null,
  selectedFolderId: null,
  selectedTaskId: null,
  savingTaskStatus: false,
  cloudRefreshStatus: false,
  selectedFolderInfo: (): TaskFolderType | null => {
    const globalStore = useGlobalStore.getState();
    if (!globalStore.selectedFolderId) return null;
    if (Object.keys(GROUP_FILTERS).includes(globalStore.selectedFolderId)) {
      return {
        id: globalStore.selectedFolderId,
        name: GROUP_FILTERS[globalStore.selectedFolderId],
        isDefaultFolder: false
      }
    }
    return globalStore.taskFolderDict[globalStore.selectedFolderId];
  },
  selectedTaskInfo: () => {
    const globalStore = useGlobalStore.getState();
    if (!globalStore.selectedTaskId) return null;
    return globalStore.taskDict[globalStore.selectedTaskId];
  },
  taskFolders: () => {
    const globalStore = useGlobalStore.getState();
    return Object.values(globalStore.taskFolderDict);
  },
  tasksFromFolder: () => {
    const globalStore = useGlobalStore.getState();
    const taskList = Object.values(globalStore.taskDict);

    // filter here
    const selectedFolderId = globalStore.selectedFolderId;

    let filter = (task: TaskType) => task.parentFolderId === selectedFolderId;

    if (selectedFolderId === 'TODAY_TASK') {
      filter = (task: TaskType) => {
        const taskDate = new Date(task.dueDateTime?.dateTime || "");
        const today = new Date();
        return task.dueDateTime !== null 
        && taskDate.getFullYear() === today.getFullYear()
        && taskDate.getMonth() === today.getMonth()
        && taskDate.getDate() === today.getDate();
      }
    } else if (selectedFolderId === 'IMPORTANT_TASK') {
      filter = (task: TaskType) => task.importance === 'high';
    } else if (selectedFolderId === 'SCHEDULED_TASK') {
      filter = (task: TaskType) => task.dueDateTime !== null && task.dueDateTime?.dateTime != null;
    }

    return taskList.filter(filter).sort((t1: TaskType, t2: TaskType) => {
      if (t1.status === 'completed') {
        return 1;
      } else {
        return -1;
      }
    });
  },
  selectFolder: (selectedFolderId: string | null) => {
    set({
      selectedFolderId,
      selectedTaskId: null 
    })
  },
  selectTask: (selectedTaskId: string | null) => {
    set({
      selectedTaskId
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
          defaultSelectedFolderId: taskFolder.id,
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
    if (folderId === globalStore.selectedFolderId) {
      set({
        selectedFolderId: globalStore.defaultSelectedFolderId
      })
    }
    set({
      selectedTaskId: null,
      taskFolderDict: {
        ...taskFolderDict
      }
    });
  },
  getTasksFromFolder: async (folderId: string) => {
    const globalStore = useGlobalStore.getState();
    const userAuthToken = await globalStore.ensureAuthenticatedAsync();
    const tasks = await getTasksFromFolder(userAuthToken, folderId);
    globalStore.taskDict = {};
    const taskDict = globalStore.taskDict;
    for (let task of tasks.value) {
      taskDict[task.id] = task;
    }
    set({
      taskDict: {
        ...taskDict
      }
    });
  },
  updateTaskById: async (taskId: string, updateTaskInputType: UpdateTaskInputType) => {
    if (!taskId) return;
    const globalStore = useGlobalStore.getState();
    const userAuthToken = await globalStore.ensureAuthenticatedAsync();
    set({
      savingTaskStatus: true
    })
    const result = await updateTask(userAuthToken, taskId, updateTaskInputType);

    if (result && result.error) {
      return result;
    }
    const taskDict = globalStore.taskDict;

    taskDict[result.id] = result as TaskType;
    set({
      taskDict: {
        ...taskDict,
      },
      savingTaskStatus: false
    })
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
  },
  createTaskInFolder: async (taskName: string, folderId: string) => {
    if (!taskName) return;
    const globalStore = useGlobalStore.getState();
    const userAuthToken = await globalStore.ensureAuthenticatedAsync();
    const result = await createTaskInFolder(userAuthToken, taskName, folderId);
    if (result && result.error) {
      return result;
    }

    const taskDict = globalStore.taskDict;

    taskDict[result.id] = result as TaskType;
    set({
      taskDict: {
        ...taskDict,
      },
      savingTaskStatus: false
    })
  },
  cloudRefresh: async () => {
    const globalStore = useGlobalStore.getState();
    set({
      cloudRefreshStatus: true
    });
    await globalStore.fetchTaskFolders();  
    await globalStore.getTasksFromFolder(String(globalStore.selectedFolderId));
    console.log("CLOUD REFRESH");
    set({
      cloudRefreshStatus: false
    });
  },
});

export default routeStore;
