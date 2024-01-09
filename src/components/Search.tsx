import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useState } from "react";
import { db } from "../firebase";
import { User } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { UserInfo } from "../types";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [err, setErr] = useState(false);
  const currentUser = useContext(AuthContext);

  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    event.code === "Enter" && handleSearch();
  };

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data() as User);
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleSelect = async () => {
    // check whether the  group(chats in firestore) exists. if not create
    if (currentUser && user) {
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      try {
        const res = await getDoc(doc(db, "chats", combinedId));
        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "chats", combinedId), { messages: [] });
          //create user chats
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            } as UserInfo,
            [combinedId + ".date"]: serverTimestamp(),
          });

          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            } as UserInfo,
            [combinedId + ".date"]: serverTimestamp(),
          });
        }
      } catch (err) {
        setErr(true);
      }
    }
    setUser(undefined);
    setUsername("");
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user?.photoURL || ""} alt="" />
          <div className="userChatInfo">
            <span>{user?.displayName || ""}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
