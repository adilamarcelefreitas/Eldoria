import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Auth } from "./firebaseInit.js";

export const createUser = async (email, password, name) => {
  return createUserWithEmailAndPassword(Auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await updateProfile(user, { displayName: name })
    });
}

export const login = (email, password) => signInWithEmailAndPassword(Auth, email, password);

export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(Auth, provider);
};

export const logOut = () => signOut(Auth);