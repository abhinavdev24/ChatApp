import { useContext, useEffect, useRef } from "react";
import { MessageType } from "../types";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }: { message: MessageType }) => {
  const currentUser = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  console.log("message", message);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [message]);

  return (
    <div
      className={`message ${
        currentUser && message.senderId === currentUser.uid && "owner"
      }`}
      ref={ref}
    >
      <div className="messageInfo">
        <img
          src={
            currentUser &&
            currentUser.photoURL &&
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.userInfo.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
