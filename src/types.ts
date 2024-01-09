export interface UserInfo {
  displayName: string;
  photoURL: string;
  uid: string;
}

export interface Chat {
  chatId: string;
  user: UserInfo;
}

export type ChatContextAction = { type: "CHANGE_USER"; payload: UserInfo };
