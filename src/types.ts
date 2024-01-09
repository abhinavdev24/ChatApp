import { Timestamp } from "firebase/firestore";

/**
 * Information about a user.
 * @interface UserInfo
 * @property {string} displayName - The display name of the user.
 * @property {string} photoURL - The URL of the user's profile photo.
 * @property {string} uid - The unique identifier for the user.
 * @property {string | undefined} [lastMessage] - The last message sent by the user.
 */
export interface UserInfo {
  displayName: string;
  photoURL: string;
  uid: string;
  lastMessage?: string;
}

/**
 * Represents a chat. Related collection - "userChats"
 * @interface Chat
 * @property {string} chatId - The unique identifier for the chat.
 * @property {UserInfo} userInfo - Information about the user associated with the chat.
 * @property {Timestamp | undefined} [date] - The timestamp representing the date when the chat was created.
 */
export interface Chat {
  chatId: string;
  userInfo: UserInfo;
  date?: Timestamp;
}

/**
 * Represents a chat message. Related collection - "chats"
 *
 * @interface Message
 * @property {string} id - The unique identifier of the message.
 * @property {string} text - The text content of the message.
 * @property {string} senderId - The unique identifier of the message sender.
 * @property {Timestamp} date - The timestamp indicating when the message was sent.
 * @property {string} img - The URL of an image associated with the message.
 */
export interface Message {
  id: string;
  text: string;
  senderId: string;
  date: Timestamp;
  img?: string;
}

export type ChatContextAction = { type: "CHANGE_USER"; payload: UserInfo };
