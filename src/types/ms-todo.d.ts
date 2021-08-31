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
