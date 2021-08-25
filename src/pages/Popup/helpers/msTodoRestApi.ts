import { TaskFolderType, TaskType } from 'types/ms-todo';

const baseUrl = 'https://graph.microsoft.com/beta/me';

type ODataResultWrapper<T> = {
  '@odata.context': string;
  value: T[];
  '@odata.deltaLink': string;
};

const request = (
  method = 'GET',
  endpoint: string,
  bearer: string,
  { queries = {}, body = {}, headers = {}, ...theRest } = {}
): Promise<any> => {
  console.log('headers', headers);
  const data = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearer}`,
      ...headers,
    },
    ...theRest,
  } as any;
  if (method != 'GET') {
    data['body'] = JSON.stringify(body);
  }
  return fetch(
    `${baseUrl}${endpoint}${new URLSearchParams(queries).toString()}`, data
  ).then((data) => {
    if (data.status === 204) {
      return null;
    }
    return data.json() as any;
  });
};

export const getTaskFolders = (
  bearer: string
): Promise<ODataResultWrapper<TaskFolderType>> => {
  let queries = new URLSearchParams({}).toString();
  return request('GET', `/outlook/taskfolders${queries}`, bearer, {
    headers: { Prefer: 'odata.track-changes' },
  });
};

export const getTasksFromFolder = (
  bearer: string,
  folderId: string
): Promise<ODataResultWrapper<TaskType>> => {
  return request('GET', `/outlook/taskfolders('${folderId}')/tasks`, bearer, {
    headers: { Prefer: 'odata.track-changes' },
  });
};

export const updateTaskFolder = (
  bearer: string,
  folderId: string,
  name: string
): Promise<any> => {
  return request('PATCH', `/outlook/taskfolders('${folderId}')`, bearer, {
    body: {
      name,
    },
  });
};

export const deleteTaskFolder = (
  beaer: string,
  folderId: string
): Promise<any> => {
  return request('DELETE', `/outlook/taskfolders('${folderId}')`, beaer);
};

export const getMe = (bearer: string): Promise<any> => {
  return request('GET', ``, bearer);
};
