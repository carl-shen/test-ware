export interface AppState {
  [key: string]: any;
}

export interface AlertMessage {
  type: string;
  message?: string;
}

export interface User {
  id: string;
  token?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  deleting?: boolean;
}
