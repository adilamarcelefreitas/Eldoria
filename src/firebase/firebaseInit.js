import { getAuth } from 'firebase/auth';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app"s Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAP8GvODNyvYJMcm4Dxl_CqhszbL2hzWOo',
  authDomain: 'eldoria-9a73d.firebaseapp.com',
  projectId: 'eldoria-9a73d',
  storageBucket: 'eldoria-9a73d.appspot.com',
  messagingSenderId: '680173100269',
  appId: '1:680173100269:web:84f508f3b10b565dc840e4',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const db = getFirestore(app);
