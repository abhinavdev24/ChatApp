import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_KEY,
  authDomain: "chat-app-abhinavcreations.firebaseapp.com",
  projectId: "chat-app-abhinavcreations",
  storageBucket: "chat-app-abhinavcreations.appspot.com",
  messagingSenderId: "431384019994",
  appId: "1:431384019994:web:d8c0b8aebb8696f12bfda3",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
