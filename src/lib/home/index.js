import firstLogoBlue from '../../assets/Logo-blue.png';
import { newPost, acessPost } from '../../firebase/firebaseStore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import {
//   accessPost, editPost, likeCounter, deslikeCounter, deletePost,
// } from '../../servicesFirebase/firebaseStore.js';

export default () => {
  const homeContainer = document.createElement('div');
  homeContainer.classList.add('home-container');

  const content = `
      <header class = 'header-home'>
        <nav id='hamburguer' class='menu-hamburguer'>
        <i class="fa-solid fa-bars" id='menu-icon'></i>
          <ul class='menu-items'>
            <li><a href=""><i class='fa-solid fa-circle-user'></i></a><span class='menu-text'>Perfil</span></li>
            <li><i class='fa-solid fa-toggle-on custom-button'id='toggle-on'></i></li>
            <li><i class='fa-solid fa-toggle-off custom-button'id='toggle-off'></i></li>
            <li><button type='button' id='btn-logout'><i class='fa-solid fa-arrow-right-from-bracket'></i></button><span class='menu-text'>Sair</span></li>
          </ul>
        </nav>
      </header>
      <main>
        <picture>
        <img src='../../assets/Logo-blue.png' id='Logo-blue'>
        </picture>
        <div class='container'>
        <section class='search-container'>
          <i class='fa-solid fa-magnifying-glass search-icon'></i>
          <input type='text' class='search-input' placeholder=''/>
        </section>
        </div>
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

  function menuShow() {
    menuItems.classList.toggle('open');
    // menuIcon.style.display = 'none';
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

  // fim da função

  const auth = getAuth();

  // Função para renderizar os posts
  function renderPost(post) {
    const postFeed = homeContainer.querySelector('#post-feed');

    const postContainer = document.createElement('div');
    postContainer.className = 'post';
    const postTitle = document.createElement('h2');
    postTitle.textContent = `${post.title} - Autor: ${post.author}`;
    const postContent = document.createElement('p');
    postContent.textContent = post.content;

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postContent);

    postFeed.appendChild(postContainer);
  }

  // Função para renderizar os posts somente se o usuário estiver autenticado
  function renderPostsIfAuthenticated(username) {
    const newPostButton = homeContainer.querySelector('.new-post i');

    newPostButton.addEventListener('click', () => {
      const newPostContainer = document.createElement('div');
      newPostContainer.className = 'new-post-container';

      const postTitleInput = document.createElement('input');
      postTitleInput.type = 'text';
      postTitleInput.placeholder = 'Título';
      postTitleInput.id = 'post-title';

      const postContentTextarea = document.createElement('textarea');
      postContentTextarea.placeholder = 'Conteúdo';
      postContentTextarea.id = 'post-content';

      const publishButton = document.createElement('button');
      publishButton.textContent = 'Publicar';
      publishButton.id = 'publish-button';

      publishButton.addEventListener('click', async () => {
        try {
          const title = postTitleInput.value;
          const content = postContentTextarea.value;

          if (!title || !content) {
            alert('Preencha todos os campos.');
            return;
          }

          const newPostData = {
            title,
            content,
            author: username, // Use o nome do usuário obtido anteriormente
            timestamp: new Date(),
          };

          await newPost(
            newPostData.title,
            newPostData.content,
            newPostData.author
          );

          renderPost(newPostData);
          postTitleInput.value = '';
          postContentTextarea.value = '';
          // alert('Postagem publicada com sucesso!');
        } catch (error) {
          console.error('Erro ao criar postagem', error);
          alert('Erro ao criar postagem. Tente novamente mais tarde.');
        }
      });

      newPostContainer.appendChild(postTitleInput);
      newPostContainer.appendChild(postContentTextarea);
      newPostContainer.appendChild(publishButton);

      const postFeed = homeContainer.querySelector('#post-feed');
      postFeed.appendChild(newPostContainer);
    });
  }

  // ...

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const username = user.displayName; // Obtenha o nome do usuário

      // O usuário está autenticado, então busque e renderize os posts existentes
      try {
        const existingPosts = await acessPost(); // Use a função acessPost do seu arquivo Firestore para buscar os posts existentes
        renderPosts(existingPosts); // Renderize os posts existentes
      } catch (error) {
        console.error('Erro ao buscar posts', error);
      }

      // Em seguida, renderize os novos posts, se o usuário criar um
      renderPostsIfAuthenticated(username);
    } else {
      // O usuário não está autenticado, você pode redirecioná-lo para a página de login ou fazer algo diferente aqui
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

  // Evento de clique no botão "Sair"
  const logoutButton = homeContainer.querySelector('#btn-logout');
  logoutButton.addEventListener('click', logout);

  return homeContainer;
};
