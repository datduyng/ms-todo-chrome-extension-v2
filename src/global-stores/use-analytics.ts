/*global chrome*/

import amplitude from "amplitude-js";

const __DEV__ = !!chrome.runtime.getManifest().__DEV__;

console.log('__DEV__', __DEV__);
const AMPLITUDE_API_KEY = __DEV__ ? '4b5afcddfd5f605c7072a19fd9c128f3' : `7c3319a77ef4f3a588dc6e07b673571b`;
amplitude.getInstance().init(AMPLITUDE_API_KEY);

export const AnalyticTypes = {
  ADD_TASK: 'add task',
  MARK_DONE: 'mark done',
  VIEW: 'view app',
  CLOUD_SYNC: 'cloud sync',
  SELECT_TASK: 'select task',
  RENAME_FOLDER: 'rename folder',
  DELETE_FOLDER: 'delete folder',
  CREATE_TASK_FOLDER: 'create task folder',
  APP_OPEN: 'app open',
  LOG_IN: 'log in',
  FAIL_ON_GET_ME: 'fail on get me',
  FAIL_ON_LOG_IN: 'fail on log in',
  LOG_OUT: 'log out',
  MARK_TASK_DONE: 'mark task done',
};

export default amplitude;
