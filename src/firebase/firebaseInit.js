import { getAuth } from 'firebase/auth';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCchPt5vGR85QPy3udktqar_rkKMSDPW9g",
  authDomain: "eldoria---o-retorno.firebaseapp.com",
  projectId: "eldoria---o-retorno",
  storageBucket: "eldoria---o-retorno.appspot.com",
  messagingSenderId: "930958267731",
  appId: "1:930958267731:web:f65f17a1ea610a636bfda6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);