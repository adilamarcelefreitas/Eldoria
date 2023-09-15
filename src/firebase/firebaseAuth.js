import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { app } from './firebaseInit.js';

export const Auth = getAuth(app);

export const createUser = (email, password, name) => createUserWithEmailAndPassword(Auth, email, password)
 .then((userCredential) => {

  const user = userCredential.user;
  return updateProfile(user, {name});
 });

 export const login = (email, password) => signInWithEmailAndPassword(Auth, email, password);

 export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(Auth, provider);
 };

 export const logOut = () => signOut(Auth);