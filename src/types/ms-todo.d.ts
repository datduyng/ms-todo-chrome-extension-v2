export type TaskType = {
  id: string;
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
