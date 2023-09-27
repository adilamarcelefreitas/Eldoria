import firstLogoBlue from '../../assets/Logo-blue.png';
import sendIcon from '../../assets/send.png';
import heartIconWhite from '../../assets/heart-white.png';
import heartIconBlack from '../../assets/heart-black.png';
import editIconWhite from '../../assets/edit-white.png';
import editIconBlack from '../../assets/edit-black.png';
import binIconWhite from '../../assets/bin-white.png';
import binIconBlack from '../../assets/bin-black.png';
import {
  newPost,
  acessPost,
  likeCounter,
  deslikeCounter,
  deletePost,
} from '../../firebase/firebaseStore.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseInit.js';
// import {
//   accessPost, editPost, likeCounter, deslikeCounter, deletePost,
// } from '../../servicesFirebase/firebaseStore.js';

export default async () => {
  const homeContainer = document.createElement('div');
  homeContainer.classList.add('home-container');
  let isNewPostContainerCreated = false;

  const content = `
      <header class = 'header-home'>
        <nav id='hamburguer' class='menu-hamburguer'>
        <div id='menu-mobile'>
          <i class="fa-solid fa-bars" id='menu-icon'></i>
            <ul class='menu-items'>
              <li><a href=""><i class='fa-solid fa-circle-user icon-user-menu'></i></a><span class='menu-text'>Perfil</span></li>
              <li><i class='fa-solid fa-toggle-on custom-button'id='toggle-on'></i></li>
              <li><i class='fa-solid fa-toggle-off custom-button'id='toggle-off'></i></li>
              <li><button type='button' id='btn-logout'><i class='fa-solid fa-arrow-right-from-bracket'></i></button><span class='menu-text'>Sair</span></li>
            </ul>
        </div>
        </nav>
           <nav>
          <div id='menu-desktop'>
            <picture>
              <img src='../../assets/Logo-blue.png' id='logo-blue-dektop'>
            </picture>
            <ul class='menu-items-desktop'>
              <li><a href=""><i class="fa-solid fa-house"></i></a><span class=''>Página incial</span></li>
              <li>
                <i class='fa-solid fa-magnifying-glass search-icon-desktop'></i>
                <input type='text' class='search-input-desktop' placeholder='pesquisar'/>
              </li>
              <li><a href=""><i class='fa-solid fa-circle-user icon-user-desktop'></i></a><span class='menu-text'>Perfil</span></li>
              <li><button type='button' id='btn-logout-desktop'><i class='fa-solid fa-arrow-right-from-bracket'></i></button><span class='menu-text'>Sair</span></li>
            </ul>
          </div>
        </nav>
      </header>
      <main id='main'>
        <picture>
        <img src='../../assets/Logo-blue.png' id='logo-blue'>
        </picture>
        <div class='search-container'>
        <section class='section-search'>
          <i class='fa-solid fa-magnifying-glass search-icon'></i>
          <input type='text' class='search-input' placeholder=''/>
        </section>
        </div>
        <div id='new-post-container'></div>
        <div class='container-feed' id='post-feed'>
        </div>
      </main>
      
      <footer class='footer-home'>
        <div class='new-post'>
        <i class="fa-solid fa-plus" id="publish-button"> </i>
        </div>
      </footer>
    `;

  homeContainer.innerHTML = content; // Insere o conteúdo HTML dentro do contêiner.

  const menuIcon = homeContainer.querySelector('#menu-icon');
  const menuItems = homeContainer.querySelector('.menu-items');

  function closeMenuOnClickOutside(event) {
    if (!menuItems.contains(event.target) && event.target !== menuIcon) {
      //verifica se o evento de clique é no próprio menuItems ou no menuIcon
      menuItems.classList.remove('open');
    }
  }

  function menuShow() {
    if (menuItems.classList.contains('open')) {
      menuItems.classList.remove('open');
      menuItems.style.zIndex = '0';
    } else {
      menuItems.classList.add('open');
      menuItems.style.zIndex = '1';

      document.addEventListener('click', closeMenuOnClickOutside);
    }
  }

  menuIcon.addEventListener('click', menuShow);

  // função para o botão do modo noturno

  let isNightMode = true;
  const toggleButtonOn = homeContainer.querySelector('#toggle-on');
  const toggleButtonOff = homeContainer.querySelector('#toggle-off');

  function toggleNightMode() {
    isNightMode = !isNightMode;
    const body = document.body;

    body.classList.remove('login-background');

    if (isNightMode) {
      // ativar o modo noturno
      body.classList.add('night-mode');
      body.classList.remove('background-white');
      toggleButtonOn.style.display = 'block';
      toggleButtonOff.style.display = 'none';
    } else {
      // desativar o modo noturno
      body.classList.add('background-white');
      body.classList.remove('night-mode');
      toggleButtonOn.style.display = 'none';
      toggleButtonOff.style.display = 'block';
    }
  }

  toggleNightMode();
  toggleButtonOn.addEventListener('click', toggleNightMode);
  toggleButtonOff.addEventListener('click', toggleNightMode);

  const auth = getAuth();
  const existingPosts = await acessPost();
  existingPosts.forEach((item) => renderPost(item));

  function renderPost(post) {
    console.log(post);

    const postFeed = homeContainer.querySelector('#post-feed');
    const postContainer = document.createElement('div');
    postContainer.className = 'post';

    const userContainer = document.createElement('div');
    userContainer.className = 'user-container';

    const userTitle = document.createElement('div');
    userTitle.className = 'user-title';

    const postIcon = document.createElement('i');
    postIcon.className = 'fa-solid fa-circle-user';

    const postTitle = document.createElement('h2');
    postTitle.textContent = `${post.userName}`;

    const postContent = document.createElement('p');
    postContent.textContent = post.post;

    const editButton = document.createElement('button');
    editButton.innerHTML = `<img width='25px' height='auto' src="${editIconBlack}">`;
    editButton.className = 'edit-button';

    const userActions = document.createElement('div');
    userActions.className = 'user-actions';

    const likeAction = document.createElement('div');
    likeAction.className = 'like-actions';

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<img width='25px' height='auto' src="${binIconBlack}">`;
    deleteButton.className = 'delete-button';

    const likeButton = document.createElement('button');
    likeButton.innerHTML = `<img width='25px' height='auto' src="${heartIconBlack}">`;
    likeButton.className = 'like-button';

    const likeCount = document.createElement('span');
    likeCount.className = 'like-count';
    likeCount.textContent = '0';

    userTitle.appendChild(postIcon);
    userTitle.appendChild(postTitle);
    userContainer.appendChild(userTitle);
    userContainer.appendChild(editButton);
    postContainer.appendChild(userContainer);
    postContainer.appendChild(postContent);
    postContainer.appendChild(userActions);

    userActions.appendChild(deleteButton);
    likeAction.appendChild(likeCount);
    likeAction.appendChild(likeButton);
    userActions.appendChild(likeAction);
    postContainer.setAttribute('data-post-id', post.id);
    postFeed.appendChild(postContainer);

    likeButton.addEventListener('click', async () => {
      const postId = likeButton.closest('.post').getAttribute('data-post-id');

      const auth = getAuth();
      const user = auth.currentUser;
      const idUserAtual = user ? user.uid : null;
      
      try {
        const hasLiked = await checkIfUserLiked(postId, idUserAtual);

        if (!hasLiked) {
          await likeCounter(postId, idUserAtual);

          const likeCountElement = likeButton.nextElementSibling;
          if (likeCountElement) {
            const currentCount = parseInt(likeCountElement.textContent);
            if (!isNaN(currentCount)) {
              const newCount = currentCount + 1;
              likeCountElement.textContent = newCount;
            } else {
              console.error('O conteúdo do contador de curtidas não é um número válido:', likeCountElement.textContent);
            }
          } else {
            console.error('Elemento do contador de curtidas não encontrado.');
          }
        } else {
          await deslikeCounter(postId, idUserAtual);
    
          const likeCountElement = likeButton.nextElementSibling;
          if (likeCountElement) {
            const currentCount = parseInt(likeCountElement.textContent);
            if (!isNaN(currentCount)) {
              const newCount = currentCount - 1;
              likeCountElement.textContent = newCount;
            } else {
              console.error('O conteúdo do contador de curtidas não é um número válido:', likeCountElement.textContent);
            }
          } else {
            console.error('Elemento do contador de curtidas não encontrado.');
          }
        }
      } catch (error) {
        console.error('Erro ao curtir o post', error);
        alert('Erro ao curtir o post. Tente novamente mais tarde.');
      }
    });
  }

  function renderPostsIfAuthenticated(userName, idUser) {
    // const newPostButton = homeContainer.querySelector('.new-post i');
    const newPostContainerLocation = homeContainer.querySelector(
      '#new-post-container'
    );

    if (!isNewPostContainerCreated) {
      const newPostContainer = document.createElement('div');
      newPostContainer.className = 'new-post-container';

      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-circle-user';

      const userNameElement = document.createElement('h2');
      userNameElement.className = 'username';
      userNameElement.textContent = `${userName}`;

      const postContentDiv = document.createElement('div');
      postContentDiv.className = 'post-content-div';

      const postContentTextarea = document.createElement('textarea');
      postContentTextarea.placeholder = 'O que você leu hoje?';
      postContentTextarea.id = 'post-content';

      // Adiciona o ícone e a <textarea> como filhos do div de conteúdo
      postContentDiv.appendChild(icon);
      postContentDiv.appendChild(userNameElement);
      postContentDiv.appendChild(postContentTextarea);

      // Adiciona a div de conteúdo ao contêiner da postagem
      newPostContainer.appendChild(postContentDiv);

      const publishButton = document.createElement('button');
      publishButton.innerHTML = `<img src="${sendIcon}">`;
      publishButton.id = 'send-icon';

      const contentBox = document.createElement('div');
      contentBox.className = 'content-box';

      contentBox.appendChild(postContentTextarea);
      contentBox.appendChild(publishButton);
      newPostContainer.appendChild(contentBox);

      publishButton.addEventListener('click', async () => {
        try {
          const contentPost = postContentTextarea.value;

          if (!contentPost) {
            alert('Preencha todos os campos.');
            return;
          }

          const newPostData = {
            userName,
            idUser,
            post: contentPost,
            timestamp: new Date(),
          };

          await newPost(
            newPostData.post,
            newPostData.userName,
            newPostData.idUser
          );

          renderPost(newPostData);
          postContentTextarea.value = '';
          // alert('Postagem publicada com sucesso!');
        } catch (error) {
          console.error('Erro ao criar postagem', error);
          alert('Erro ao criar postagem. Tente novamente mais tarde.');
        }
      });

      const postFeed = homeContainer.querySelector('#post-feed');
      postFeed.appendChild(newPostContainer);

      newPostContainerLocation.appendChild(newPostContainer);
      isNewPostContainerCreated = true;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPostsIfAuthenticated(userName, idUser);
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const username = user.displayName; // Obtenha o nome do usuário
      const userId = user.uid;
      // O usuário está autenticado, então busque e renderize os posts existentes
      try {
        const existingPosts = await acessPost();
        renderPost(existingPosts);
      } catch (error) {
        console.error('Erro ao buscar posts', error);
      }
      renderPostsIfAuthenticated(username, userId);
    } else {
    }
  });

  // Função para fazer logout
  function logout() {
    signOut(auth)
      .then(() => {
        window.location = '/';
      })
      .catch((error) => {
        console.error('Erro ao fazer logout', error);
        alert('Erro ao fazer logout. Tente novamente mais tarde');
      });
  }

  // função de busca
  function filterPosts(searchValue) {
    const postFeed = homeContainer.querySelector('#post-feed');
    const posts = postFeed.querySelectorAll('.post');

    posts.forEach((post) => {
      const postContent = post.querySelector('p').textContent.toLowerCase();
      const postTitle = post.querySelector('h2').textContent.toLowerCase();
      if (
        postContent.includes(searchValue) ||
        postTitle.includes(searchValue)
      ) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  }

  // Evento de clique no botão "Sair"
  const logoutButton = homeContainer.querySelector('#btn-logout');
  logoutButton.addEventListener('click', logout);

  const searchInput = homeContainer.querySelector('.search-input');
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    filterPosts(searchValue);
  });

  // função do like
  const likeButtons = document.querySelectorAll('.like-button');

  function updateLikeCount(postId, count) {
    const likeCountElement = document.querySelector(
      `[data-post-id="${postId}"] .like-count`
    );
    if (likeCountElement) {
      likeCountElement.textContent = count.toString();
    }
  }

  // Função para lidar com o clique no botão "Curtir"
  async function handleLikeButtonClick(likeButton) {
    const postId = likeButton.closest('.post').getAttribute('data-post-id');
    const currentUserDisplayName = Auth.currentUser.displayName;
    const likeCountElement = likeButton.closest('.post').querySelector('.like-count');

    try {
      const hasLiked = await checkIfUserLiked(postId, 'idUserAtual');

      if (!hasLiked) {
        await likeCounter(postId, 'idUserAtual');

        const currentCount = parseInt(
          likeButton.nextElementSibling.textContent
        );
        const newCount = currentCount + 1;
        likeButton.nextElementSibling.textContent = newCount; // Atualiza a contagem no DOM
      } else {
        await deslikeCounter(postId, 'idUserAtual');

        const currentCount = parseInt(
          likeButton.nextElementSibling.textContent
        );
        const newCount = currentCount - 1;
        likeButton.nextElementSibling.textContent = newCount; // Atualiza a contagem no DOM
      }
    } catch (error) {
      console.error('Erro ao curtir o post', error);
      alert('Erro ao curtir o post. Tente novamente mais tarde.');
    }
  }

  async function checkIfUserLiked(postId, userId) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();

        if (postData.likeUsers && postData.likeUsers.includes(userId)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Erro ao verificar se o usuário curtiu o post:', error);
      throw error;
    }
  }

  return homeContainer;
};
