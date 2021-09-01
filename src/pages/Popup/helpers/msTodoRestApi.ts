import { TaskFolderType, TaskType, ErrorResponse, TaskStatusType, UpdateTaskInputType } from 'types/ms-todo';

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

export const createTaskFolder = (
  bearer: string,
  name: string
): Promise<TaskFolderType & ErrorResponse> => {
  return request('POST', `/outlook/taskfolders`, bearer, {
    body: {
      name,
    },
  });
}

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

export const updateTask = (bearer: string, taskId: string, updateTaskInput: UpdateTaskInputType): Promise<TaskType & ErrorResponse> => {
  const data = {} as any;
  if (updateTaskInput.subject) {
    data.subject = updateTaskInput.subject;
  }
  if (updateTaskInput.body?.content) {
    data.body = {
      content: updateTaskInput.body.content,
      contentType: 'html'
    }
  }
  if (updateTaskInput.importance) {
    data.importance = updateTaskInput.importance;
  }
  if (updateTaskInput.status) {
    data.status = updateTaskInput.status;
  }
  if (updateTaskInput.dueDateTime) {
    data.dueDateTime = {
      dateTime: updateTaskInput.dueDateTime.dateTime,
      timeZone: updateTaskInput.dueDateTime.timeZone,
    }
  }
  return request('PATCH', `/outlook/tasks/${taskId}`, bearer, {
    body: data
  })
}
