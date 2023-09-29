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
import { app } from './firebaseInit.js';
// import { async } from 'regenerator-runtime';

const db = getFirestore(app);

export const userData = async (name, lastname) => addDoc(collection (db, 'infos-add'), {
  nome: name,
  sobrenome: lastname,
});

export const newPost = async (postagem, username, id) => addDoc(collection (db, 'posts'), {
  userName: username,
  post: postagem,
  idUser: id,
  likes: 0,
  likeUsers: [],
  timestamp: new Date(),
});

export const acessPost = async () => {
  const messages = [];
  const queryOrder = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(queryOrder);
  querySnapshot.forEach((item) => {
    const data = item.data();
    data.id = item.id;
    console.log(data);
    messages.push(data);
  });
  return messages;
};

export const editPost = (postId, textArea) => { updateDoc(doc(db, 'posts', postId), {
  post: textArea,
})};

export const likeCounter = async (postId, usernameUser) => updateDoc(doc(db, 'posts', postId), {
  likeUsers: arrayUnion(usernameUser),
});

export const deslikeCounter = async (postId, usernameUser) => updateDoc(doc(db, 'posts', postId), {
  likeUsers: arrayRemove(usernameUser),
});

export const deletePost = async (postId) => {
  try {
      // Use a função deleteDoc para excluir o documento com o ID do post
      await deleteDoc(doc(db, 'posts', postId));
      console.log('Post excluído com sucesso');
  } catch (error) {
      console.error('Erro ao excluir o post:', error);
      throw error; // Rejeita a promessa para que o erro possa ser tratado no local de chamada
  }
};