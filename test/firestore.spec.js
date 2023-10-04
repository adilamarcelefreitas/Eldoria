import {
  addDoc,
  collection,
  // getDocs,
  // orderBy,
  // query,
  // doc,
  // updateDoc,
  // arrayUnion,
  // arrayRemove,
  // deleteDoc,
  getFirestore,
} from 'firebase/firestore';

// import { async } from 'regenerator-runtime';
// import {
//   accessPost,
//   newPost,
//   userData,
//   editPost,
//   likeCounter,
//   deslikeCounter,
//   deletePost,
// } from '../src/firebase/firebaseStore';

import { app } from '../src/firebase/firebaseInit';

const db = getFirestore(app);

export const useData = async (name, lastname) => {
  try {
    // adicionando um documento a coleção com nome e sobrenome
    await addDoc(collection(db, 'infos-add'), {
      nome: name,
      sobrenome: lastname,
    });
    console.log('usuario adicionado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar dados do usuário', error);
    throw error; // o throw vai rejeitar a promessa para que o erro
    // possa ser tratado no local de chamada
  }
};

// export const deslikeCounter = async (postId, usernameUser) => {
//   try {
//     //atualiza o documento do post com ID fornecido para remover o usuario dos likes
//     await updateDoc(doc(db, "posts", postId), {
//       likeUsers: arrayRemove(usernameUser),
//     });
//     console.log("contagem de deslike atualizada com sucesso");
//   } catch (error) {
//     console.error("Erro ao atualizar a contagem de deslike", error);
//     throw error;
//   }
// };

// export const deletePost = async (postId) => {
//   try {

//     await deleteDoc(doc(db, "posts", postId));
//     console.log("Post excluído com sucesso");
//   } catch (error) {
//     console.error("Erro ao excluir o post:", error);
//     throw error;
//   }
// };
