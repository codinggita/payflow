import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8pyZa6strVhiqka6vRab7vtfPXAPh9oU",
  authDomain: "payflow-5bf92.firebaseapp.com",
  projectId: "payflow-5bf92",
  storageBucket: "payflow-5bf92.firebasestorage.app",
  messagingSenderId: "629132406610",
  appId: "1:629132406610:web:eae3b3b7ed9b5ba23e548b",
  measurementId: "G-EPK6SVWE7W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export { auth, provider };
