import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { MessageType } from "../types";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [err, setErr] = useState(false);

  const currentUser = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (currentUser && data.chatId) {
      const message: MessageType = {
        id: uuid(),
        text,
        senderId: currentUser?.uid,
        date: Timestamp.now(),
      };
      if (img) {
        const storageRef = ref(storage, uuid());

        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            // Handle unsuccessful uploads
            console.log(error);
            setErr(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    ...message,
                    img: downloadURL,
                  } as MessageType),
                });
              }
            );
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion(message),
        });
      }
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: text,
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.userInfo.uid), {
        [data.chatId + ".lastMessage"]: text,
        [data.chatId + ".date"]: serverTimestamp(),
      });
      setText("");
      setImg(null);
      console.log("clear screen");
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => e.target.files && setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
      {err && <p>Something went wrong</p>}
    </div>
  );
};

export default Input;
