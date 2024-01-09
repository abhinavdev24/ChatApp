import { Timestamp } from "firebase/firestore";

export interface UserInfo {
  displayName: string;
  photoURL: string;
  uid: string;
  lastMessage?: string;
}

export interface Chat {
  chatId: string;
  userInfo: UserInfo;
  date?: Timestamp;
}

export type ChatContextAction = { type: "CHANGE_USER"; payload: UserInfo };
