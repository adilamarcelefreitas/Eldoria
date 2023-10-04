import {  
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  query,
  orderBy, 
} from 'firebase/firestore';
import { app } from './firebaseinit.js';
// import { async } from 'regenerator-runtime';

const db = getFirestore(app);

export const userData = (name, lastname) => { addDoc(collection(db, 'infos-add'), {
  nome: name,
  sobrenome: lastname,
})};

export const newPost = async (postagem, username, id) => { addDoc(collection (db, 'posts'), {
  userName: username,
  post: postagem,
  idUser: id,
  likes: 0,
  likeUsers: [],
})};

export const acessPost = async () => {
  const messages = [];
  const queryOrder = query(collection(db, 'posts'), orderBy('data'));
  const querySnapshot = await getDocs(queryOrder);
  querySnapshot.forEach ((item) => {
    const data = item.data();
    data.id = item.id;
    messages.push(data);
  })
  return messages;
};

export const editPost = (postId, textArea) => { updateDoc(doc(db, 'post', postId), {
  post: textArea,
})};

export const likeCounter = async (postId, usernameUser) => updateDoc(doc(db, 'posts', postId), {
  likeUsers: arrayUnion(usernamesUser),
});

export const deslikeCounter = async (postId, usernameUser) => updateDoc(doc(db, 'posts', postId), {
  likeUsers: arrayRemove(usernameUser),
});

export const deletePost = async (postId) => deleteDoc(doc(db, 'posts', postId));