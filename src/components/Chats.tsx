import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Chat, ChatContextAction, UserInfo } from "../types";

const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    let unsub = () => {};
    if (currentUser) {
      unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const data = doc.data();
        if (data)
          setChats(
            Object.entries(data).map((chat) => {
              return {
                chatId: chat[0],
                userInfo: chat[1].userInfo,
                date: chat[1].date,
              };
            })
          );
      });
    }

    return () => {
      unsub();
    };
  }, [currentUser]);

  const handleSelect = (userInfo: UserInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo } as ChatContextAction);
  };

  return (
    <div className="chats">
      {chats.map((chat) => (
        <div
          className="userChat"
          key={chat.chatId}
          onClick={() => handleSelect(chat.userInfo)}
        >
          <img src={chat.userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat.userInfo.displayName}</span>
            <p>{chat.userInfo.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
