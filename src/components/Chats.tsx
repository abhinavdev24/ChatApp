import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { ChatContextAction, UserInfo } from "../types";

const Chats = () => {
  const [chats, setChats] = useState<DocumentData>([]);
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    let unsub = () => {};
    if (currentUser) {
      unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const data = doc.data();
        if (data) setChats(data);
      });
    }

    return () => {
      unsub();
    };
  }, [currentUser]);

  console.log(Object.entries(chats));

  const handleSelect = (userInfo: UserInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo } as ChatContextAction);
  };

  return (
    <div className="chats">
      {Object.entries(chats)?.map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].userInfo.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
