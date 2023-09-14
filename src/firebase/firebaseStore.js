// import {  
//   getFirestore,
//   collection,
//   addDoc,
//   getDocs,
//   doc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   deleteDoc,
//   query,
//   orderBy, 
// } from 'firebase/firestore';
// import { app } from './firebaseInit.js';
// import { async } from 'regenerator-runtime';

// const db = getFirestore(app);

// export const userData = (name, lastname) => addDoc(collection(db, 'infos-add'), {
//   nome: name,
//   sobrenome: lastname,
// });

// export const newPost = async ()