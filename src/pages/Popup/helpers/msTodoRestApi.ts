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
  { queries = {}, params = {}, headers = {} } = {}
): Promise<any> => {
  console.log('headers', headers);
  return fetch(
    `${baseUrl}${endpoint}${new URLSearchParams(queries).toString()}`,
    {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearer}`,
        ...headers,
      },
      ...params,
    }
  ).then((data) => data.json() as any);
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

export const getMe = (bearer: string): Promise<any> => {
  return request('GET', ``, bearer);
};
