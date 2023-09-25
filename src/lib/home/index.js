import firstLogoBlue from '../../assets/Logo-blue.png';
// import sendIcon from '../../assets/send-publish.png';
import { newPost, acessPost } from '../../firebase/firebaseStore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
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
        <i class="fa-solid fa-bars" id='menu-icon'></i>
          <ul class='menu-items'>
            <li><a href=""><i class='fa-solid fa-circle-user'></i></a><span class='menu-text'>Perfil</span></li>
            <li><i class='fa-solid fa-toggle-on custom-button'id='toggle-on'></i></li>
            <li><i class='fa-solid fa-toggle-off custom-button'id='toggle-off'></i></li>
            <li><button type='button' id='btn-logout'><i class='fa-solid fa-arrow-right-from-bracket'></i></button><span class='menu-text'>Sair</span></li>
          </ul>
        </nav>
      </header>
      <main id='container'>
        <picture>
        <img src='../../assets/Logo-blue.png' id='Logo-blue'>
        </picture>
        <div class='container'>
        <section class='search-container'>
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
    if (!menuItems.contains(event.target) && event.target !== menuIcon) { //verifica se o evento de clique é no próprio menuItems ou no menuIcon
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

  // fim da função

  const auth = getAuth();
  const existingPosts = await acessPost();
  existingPosts.forEach(item => renderPost(item));


  function renderPost(post) {
    console.log(post);

    const postFeed = homeContainer.querySelector('#post-feed');
    const postContainer = document.createElement('div');
    postContainer.className = 'post';

    const userContainer = document.createElement('div');
    userContainer.className = 'user-container';

    const postIcon = document.createElement('i');
    postIcon.className = 'fa-solid fa-circle-user';

    const postTitle = document.createElement('h2');
    postTitle.textContent = `${post.userName}`;

    const postContent = document.createElement('p');
    postContent.textContent = post.post;

    userContainer.appendChild(postIcon);
    userContainer.appendChild(postTitle);

    postContainer.appendChild(userContainer);
    postContainer.appendChild(postContent);
    postFeed.appendChild(postContainer);
  }

  // Função para renderizar os posts somente se o usuário estiver autenticado
  function renderPostsIfAuthenticated(userName, idUser) {
    const newPostButton = homeContainer.querySelector('.new-post i');
    const newPostContainerLocation = homeContainer.querySelector('#new-post-container');

    newPostButton.addEventListener('click', () => {
      if (!isNewPostContainerCreated) {
        const newPostContainer = document.createElement('div');
        newPostContainer.className = 'new-post-container';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-circle-user';

        const postContentDiv = document.createElement('div');
        postContentDiv.className = 'post-content-div';

        const postContentTextarea = document.createElement('textarea');
        postContentTextarea.placeholder = 'O que você leu hoje?';
        postContentTextarea.id = 'post-content';

        //Adiciona o ícone e a <textarea> como filhos do div de conteúdo
        postContentDiv.appendChild(icon);
        postContentDiv.appendChild(postContentTextarea);

        // Adiciona a div de conteúdo ao contêiner da postagem
        newPostContainer.appendChild(postContentDiv);

        const publishButton = document.createElement('button');
        publishButton.innerHTML = `<img src='../../assets/icons8-enviado-48.png'>`;

        publishButton.id = 'publish-button';

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
              newPostData.idUser,
            );

            renderPost(newPostData);
            postContentTextarea.value = '';
            // alert('Postagem publicada com sucesso!');
          } catch (error) {
            console.error('Erro ao criar postagem', error);
            alert('Erro ao criar postagem. Tente novamente mais tarde.');
          }
        });

        newPostContainer.appendChild(postContentTextarea);
        newPostContainer.appendChild(publishButton);

        const postFeed = homeContainer.querySelector('#post-feed');
        postFeed.appendChild(newPostContainer);

        newPostContainerLocation.appendChild(newPostContainer);
        isNewPostContainerCreated = true;

      }
    });
  }


  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const username = user.displayName; // Obtenha o nome do usuário
      const userId = user.uid;
      // O usuário está autenticado, então busque e renderize os posts existentes
      try {
        const existingPosts = await acessPost(); // Use a função acessPost do seu arquivo Firestore para buscar os posts existentes
        renderPost(existingPosts); // Renderize os posts existentes
      } catch (error) {
        console.error('Erro ao buscar posts', error);
      }


      renderPostsIfAuthenticated(username, userId);
    } else {
      // O usuário não está autenticado, você pode redirecioná-lo para a página de login 
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
