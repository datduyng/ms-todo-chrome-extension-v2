export type TaskStatusType = "notStarted" | "completed";
export type TaskImportanceType = "high" | "normal";
export type TaskType = {
  id: string;
  subject: string;
  body: {
    content: string;
    contenType: string;
  };
  importance: TaskImportanceType;
  status: TaskStatusType;
  dueDateTime?: {
    dateTime: string;
    timeZone: string;
  }
};

export type UpdateTaskInputType = {
  subject?: string;
  body?: {
    content: string 
  };
  status?: TaskStatusType;
  importance?: TaskImportanceType;
  dueDateTime?: {
    dateTime: string;
    timeZone: string;
  }
};



export type TaskFolderType = {
  id: string;
  name: string;
  isDefaultFolder: boolean;
};

export type ErrorResponse = {
  error?: {
    code: string;
    message: string;
  }
}
