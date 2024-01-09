import { ReactNode, createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { Chat, ChatContextAction } from "../types";

const INITIAL_STATE: Chat = {
  chatId: "",
  userInfo: { displayName: "", photoURL: "", uid: "" },
};

export const ChatContext = createContext<{
  data: Chat;
  dispatch: React.Dispatch<ChatContextAction>;
}>({ data: INITIAL_STATE, dispatch: () => {} });

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const currentUser = useContext(AuthContext);

  const chatReducer = (state: Chat, action: ChatContextAction): Chat => {
    switch (action.type) {
      case "CHANGE_USER":
        if (currentUser)
          return {
            userInfo: action.payload,
            chatId:
              currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid,
          };
        return state;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
