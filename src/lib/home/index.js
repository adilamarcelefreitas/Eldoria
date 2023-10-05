import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  newPost,
  acessPost,
  likeCounter,
  deslikeCounter,
  deletePost,
  editPost,
} from '../../firebase/firebaseStore.js';
import { db } from '../../firebase/firebaseInit.js';
import sendIcon from '../../assets/send.png';
import firstLogoBlue from '../../assets/Logo-blue.png';

export default async () => {
  const homeContainer = document.createElement('div');
  homeContainer.classList.add('home-container');
  const isNewPostContainerCreated = false;

  const content = `
      <header class="header-home">
        <nav id="hamburguer" class="menu-hamburguer">
        <div id="menu-mobile">
          <i class="fa-solid fa-bars" id="menu-icon"></i>
            <ul class="menu-items">
              <li><a href=""><i class="fa-solid fa-circle-user icon-user-menu"></i></a><span class="menu-text">Perfil</span></li>
              <li><i class="fa-solid fa-toggle-on custom-button"id="toggle-on"></i></li>
              <li><i class="fa-solid fa-toggle-off custom-button"id="toggle-off"></i></li>
              <li><button type="button" class="btn-logout"><i class="fa-solid fa-arrow-right-from-bracket"></i></button><span class="menu-text">Sair</span></li>
            </ul>
        </div>
        </nav>
           <nav>
          <div id="menu-desktop">
            <picture>
              <img src="${firstLogoBlue}" id="logo-blue-dektop">
            </picture>
            <ul class="menu-items-desktop">
              <li class="home-page-icons"><a href=""><i class="fa-solid fa-house"></i></a><span class="menu-text-desktop">Página inicial</span></li>
              <li class="home-page-icons">
              <i class="fa-solid fa-magnifying-glass search-icon-desktop"></i>
              <input type="text" class="search-input-desktop menu-text-desktop" placeholder=Pesquisar...>
              </li>
              <li class="home-page-icons"><i class="fa-solid fa-circle-user icon-user-desktop"></i></a><span class="menu-text-desktop">Perfil</span></li>
              <li class="home-page-icons logout"><button type="button" class="btn-logout-desktop"><i class="fa-solid fa-arrow-right-from-bracket"></i></button><span class="menu-text-desktop">Sair</span></li>
            </ul>
          </div>
        </nav>
      </header>
      <main id="main">
        <picture>
          <img src="${firstLogoBlue}" id="logo-blue">
        </picture>
        <div class="search-container">
        <section class="section-search">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" class="search-input" placeholder=""/>
        </section>
        </div>
        <div id="new-post-container"></div>
        <div class="container-feed" id="post-feed">
        </div>
        <div class="footer-info">
    <section class="container-footer">
      <p>&copy; Developed by</p>
      <p>Ádila Freitas <a href="https://github.com/adilamarcelefreitas"><i class="fa-brands fa-github"></i></a> | Iana Rodrigues <a href="https://github.com/ianarodrigues"><i class="fa-brands fa-github"></i></a> | Laura de Freitas <a href="https://github.com/lauradefreitas2"><i class="fa-brands fa-github"></i></a></p>
    </section>
  </div>
      </main>
      
      <footer class="footer-home">
        <button id="scrollToTop" class="new-post">
        <i class="fa-solid fa-plus" id="publish-button"></i>
        </button>
      </footer>
    `;

  homeContainer.innerHTML = content;

  const menuIcon = homeContainer.querySelector('#menu-icon');
  const menuItems = homeContainer.querySelector('.menu-items');

  function closeMenuOnClickOutside(event) {
    if (!menuItems.contains(event.target) && event.target !== menuIcon) {
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
    const postContainers = document.querySelectorAll('.post'); // Seleciona todos os containers de postagens
    const newPostContainer = document.querySelector('.new-post-container'); // Seleciona o contêiner de nova postagem
    const menuIconMobile = homeContainer.querySelector('#menu-icon'); // Seleciona o ícone do menu hamburguer
    const menuItemsMobile = homeContainer.querySelector('.menu-items'); // Seleciona a lista de itens do menu hamburguer
    if (body) {
      body.classList.remove('login-background');

      if (isNightMode) {
        // Ativar o modo noturno
        body.classList.add('night-mode');
        body.classList.remove('background-white');
        toggleButtonOn.style.display = 'block';
        toggleButtonOff.style.display = 'none';
      } else {
        // Desativar o modo noturno
        body.classList.add('background-white');
        body.classList.remove('night-mode');
        toggleButtonOn.style.display = 'none';
        toggleButtonOff.style.display = 'block';
      }
    }

    if (postContainers) {
      // Adiciona classe do modo noturno aos containers de postagens
      postContainers.forEach((container) => {
        if (container) {
          container.classList.toggle('night-mode-post', isNightMode);
        }
      });
    }

    if (newPostContainer) {
      // Adiciona classe do modo noturno ao contêiner de nova postagem
      newPostContainer.classList.toggle('night-mode-post', isNightMode);
    }

    if (menuIconMobile) {
      // Adiciona classe do modo noturno ao ícone do menu hamburguer
      menuIconMobile.classList.toggle('night-mode-menu', isNightMode);
    }

    if (menuItemsMobile) {
      // Adiciona classe do modo noturno à lista de itens do menu hamburguer
      menuItemsMobile.classList.toggle('night-mode-menu', isNightMode);
    }
  }

  toggleNightMode();
  toggleButtonOn.addEventListener('click', toggleNightMode);
  toggleButtonOff.addEventListener('click', toggleNightMode);

  const auth = getAuth();
  const existingPosts = await acessPost();

  // Função para formatar o timestamp para uma exibição
  // function formatTimestamp(timestamp) {
  //   console.log(timestamp.toLocaleDateString(),'OKKKKKKKKKKKKKKK');
  //   const options = {
  //     month: 'numeric',
  //     day: 'numeric',
  //     hour: 'numeric',
  //     minute: 'numeric',
  //   };
  //   return new Date(timestamp * 1000).toLocaleDateString('pt-BR', options);
  // }

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

  const modalDelete = () => {
    const templateDelete = `
      <div id="fade" class="hide"></div>
      <div id="modal" class="hide">
        <p class="message-delete">Tem certeza que deseja excluir a publicação?</p> 
        <div class="button-modal">
         <button id="cancel-modal">Cancelar</button>
          <button id="delete-modal">Excluir</button>
        </div>
      </div>  
    `;
    const modalContainer = document.createElement('section');
    modalContainer.classList.add('modal-container');
    modalContainer.innerHTML = templateDelete;
    document.body.appendChild(modalContainer);

    const modal = modalContainer.querySelector('#modal');
    const fade = modalContainer.querySelector('#fade');
    const deleteModal = modalContainer.querySelector('#delete-modal');
    const cancelModal = modalContainer.querySelector('#cancel-modal');

    cancelModal.addEventListener('click', () => {
      modalContainer.remove();
    });

    deleteModal.addEventListener('click', async () => {
      await deletePost();
      modalContainer.remove();
    });

    return { fade, modal, deleteModal };
  };

  function renderPost(post) {
    console.log(post.timestamp);

    const postFeed = homeContainer.querySelector('#post-feed');
    const postContainer = document.createElement('div');
    postContainer.className = 'post';

    const userContainer = document.createElement('div');
    userContainer.className = 'user-container';

    const userTitle = document.createElement('div');
    userTitle.className = 'user-title';

    const postIcon = document.createElement('i');
    postIcon.className = 'fa-solid fa-circle-user icon-user';

    const postTitle = document.createElement('h2');
    postTitle.textContent = `${post.userName}`;

    const postContentContainer = document.createElement('div');
    postContentContainer.className = 'post-container';

    const postContent = document.createElement('p');
    postContent.textContent = post.post;

    // Cria os elementos de edição e exclusão
    let deleteButton = '';
    if (post.idUser === auth.currentUser.uid) {
      deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class=\'material-symbols-outlined\'>delete</i>';
      deleteButton.className = 'delete-button';
    }

    let editButton = '';

    if (post.idUser === auth.currentUser.uid) {
      editButton = document.createElement('button');
      editButton.innerHTML = '<i class=\'fa-regular fa-pen-to-square\'></i>';
      editButton.className = 'edit-button';
    }
    const userActions = document.createElement('div');
    userActions.className = 'user-actions';

    const likeAction = document.createElement('div');
    likeAction.className = 'like-actions like-actions-right';

    const likeButton = document.createElement('button');
    likeButton.innerHTML = '<i class=\'fa-solid fa-heart\'></i>';
    likeButton.className = 'like-button';

    const likeCount = document.createElement('span');
    likeCount.className = 'like-count';
    likeCount.textContent = post.likeUsers
      ? post.likeUsers.length.toString()
      : '0';

    // const timestampElement = document.createElement('p');
    // timestampElement.className = 'post-timestamp';
    // timestampElement.textContent = formatTimestamp(post.timestamp);

    userTitle.appendChild(postIcon);
    userTitle.appendChild(postTitle);
    userContainer.appendChild(userTitle);
    if (editButton) userContainer.appendChild(editButton);
    postContainer.appendChild(userContainer);
    postContainer.appendChild(postContentContainer);
    postContentContainer.appendChild(postContent);
    postContainer.appendChild(userActions);

    if (deleteButton) userActions.appendChild(deleteButton);
    likeAction.appendChild(likeCount);
    likeAction.appendChild(likeButton);
    userActions.appendChild(likeAction);
    postContainer.setAttribute('data-post-id', post.id);
    // postContainer.appendChild(timestampElement);
    postFeed.appendChild(postContainer);

    // lógica para os botões de editar e lixeira so aparecer para quem for dono do post

    postContainer.setAttribute('data-post-id', post.id);
    postContainer.setAttribute('data-post-author-id', post.authorId);

    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        const { fade, modal, deleteModal } = modalDelete();

        deleteModal.addEventListener('click', async () => {
          try {
            await deletePost(post.id);
            postContainer.remove();
          } catch (error) {
            console.error('Erro ao excluir o post', error);
          } finally {
            modal.remove();
            fade.remove();
          }
        });
      });
    }

    if (editButton) {
      editButton.addEventListener('click', async () => {
        likeButton.style.display = 'none';
        likeCount.style.display = 'none';
        // Recupera o conteúdo atual do post
        const postId = postContainer.getAttribute('data-post-id');
        const postContentElement = postContainer.querySelector('p'); // Obtém o elemento do conteúdo do post
        const originalContent = postContentElement.textContent;

        const editForm = document.createElement('form');
        editForm.className = 'edit-form';

        // Cria um formulário de edição preenchido com o conteúdo atual
        const editTextArea = document.createElement('textarea');
        editTextArea.value = originalContent; // Usa o conteúdo atual
        editTextArea.className = 'edit-textarea';
        editForm.appendChild(editTextArea);

        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = '<i class=\'fa-regular fa-circle-xmark\'></i>';
        cancelButton.className = 'cancel-button';
        editForm.appendChild(cancelButton);

        const saveButton = document.createElement('button');
        saveButton.innerHTML = '<i class=\'fa-regular fa-circle-check\'></i>';
        saveButton.className = 'save-button';
        editForm.appendChild(saveButton);

        postContentContainer.replaceChild(editForm, postContentElement);

        // Adiciona um manipulador de evento para o botão "Salvar"
        saveButton.addEventListener('click', async (event) => {
          event.preventDefault();
          const newContent = editTextArea.value;

          if (newContent !== originalContent) {
            try {
              // Usa a função de edição no Firebase Firestore para atualizar o conteúdo
              await editPost(postId, newContent);
              // Atualiza o conteúdo na interface do usuário
              postContentElement.textContent = newContent;

              postContentContainer.replaceChild(postContentElement, editForm);
            } catch (error) {
              console.error('Erro ao editar o post', error);
              alert('Erro ao editar o post. Tente novamente mais tarde.');
            }
          } else {
            postContentContainer.replaceChild(postContentElement, editForm);
          }
          likeButton.style.display = 'inline-block';
          likeCount.style.display = 'inline-block';
        });

        cancelButton.addEventListener('click', (event) => {
          event.preventDefault();
          postContentElement.textContent = originalContent;
          postContentContainer.replaceChild(postContentElement, editForm);

          likeButton.style.display = 'inline-block';
          likeCount.style.display = 'inline-block';
        });
      });
    }

    likeButton.addEventListener('click', async () => {
      window.location.reload(); // temporário reload de page
      const postId = likeButton.closest('.post').getAttribute('data-post-id');
      const user = auth.currentUser;
      const idUserAtual = user ? user.uid : null;

      try {
        const hasLiked = await checkIfUserLiked(postId, idUserAtual);

        if (!hasLiked) {
          await likeCounter(postId, idUserAtual);
          const likeCountElement = likeButton.nextElementSibling;
          if (likeCountElement) {
            const currentCount = parseInt(likeCountElement.textContent, 10);
            if (!Number.isNaN(currentCount)) {
              const newCount = currentCount + 1;
              likeCountElement.textContent = newCount.toString(); // Atualiza o contador de likes
            } else {
              console.error(
                'O conteúdo do contador de curtidas não é um número válido:',
                likeCountElement.textContent,
              );
            }
          } else {
            console.error('Elemento do contador de curtidas não encontrado.');
          }
        } else {
          await deslikeCounter(postId, idUserAtual);
          console.log('Descurtiu o post');
          const likeCountElement = likeButton.nextElementSibling;
          if (likeCountElement) {
            const currentCount = parseInt(likeCountElement.textContent, 10);
            if (!Number.isNaN(currentCount)) {
              const newCount = currentCount - 1;
              likeCountElement.textContent = newCount.toString(); // Atualiza o contador de likes
            } else {
              console.error(
                'O conteúdo do contador de curtidas não é um número válido:',
                likeCountElement.textContent,
              );
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

  existingPosts.forEach((item) => renderPost(item));

  function renderPostsIfAuthenticated(userName, idUser) {
    // const newPostButton = homeContainer.querySelector(".new-post i");
    const postFeed = homeContainer.querySelector('#post-feed');
    const newPostContainerLocation = homeContainer.querySelector('#new-post-container');

    if (!isNewPostContainerCreated) {
      const newPostContainer = document.createElement('div');
      newPostContainer.className = 'new-post-container';

      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-circle-user icon-user';

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
      publishButton.innerHTML = `<img src='${sendIcon}'>`;
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
            newPostData.idUser,
          );

          renderPost(newPostData);
          postContentTextarea.value = '';

          // newPostContainer.appendChild(timestampElement);

          postFeed.insertBefore(newPostContainer, postFeed.firstChild);
        } catch (error) {
          console.error('Erro ao criar postagem', error);
          alert('Erro ao criar postagem. Tente novamente mais tarde.');
        }
      });

      newPostContainerLocation.appendChild(newPostContainer);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPostsIfAuthenticated();
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const username = user.displayName;
      const userId = user.uid;

      try {
        const posts = await acessPost();
        renderPost(posts);
      } catch (error) {
        console.error('Erro ao buscar posts', error);
      }
      renderPostsIfAuthenticated(username, userId);
    }
  });

  // Função para fazer logout
  function logout() {
    console.log('Botão de sair clicado no menu desktop');

    signOut(auth)
      .then(() => {
        window.location = '/';
      })
      .catch((error) => {
        console.error('Erro ao fazer logout', error);
        alert('Erro ao fazer logout. Tente novamente mais tarde');
      });
  }

  const logoutButton = homeContainer.querySelector('.btn-logout');
  logoutButton.addEventListener('click', logout);

  const logoutButtonDesktop = homeContainer.querySelector('.btn-logout-desktop');
  logoutButtonDesktop.addEventListener('click', logout);

  // função de busca
  function filterPosts(searchValue) {
    const postFeed = homeContainer.querySelector('#post-feed');
    const posts = postFeed.querySelectorAll('.post');

    posts.forEach((post) => {
      const postContent = post.querySelector('p').textContent.toLowerCase();
      const postTitle = post.querySelector('h2').textContent.toLowerCase();
      if (postContent.includes(searchValue) || postTitle.includes(searchValue)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  }

  const searchInput = homeContainer.querySelector('.search-input');
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    filterPosts(searchValue);
  });

  const searchInputDesktop = homeContainer.querySelector('.search-input-desktop');
  searchInputDesktop.addEventListener('input', () => {
    const searchValue = searchInputDesktop.value.trim().toLowerCase();
    filterPosts(searchValue);
  });

  // Função para mostrar/ocultar o botão de scroll
  function toggleScrollToTopButton() {
    const scrollToTopButton = document.querySelector('.footer-home');

    if (scrollToTopButton) {
      if (window.scrollY > 100) {
        scrollToTopButton.style.display = 'block';
      } else {
        scrollToTopButton.style.display = 'none';
      }
    } else {
      console.error('Erro');
    }
  }

  window.addEventListener('scroll', toggleScrollToTopButton);

  const scrollToTop = homeContainer.querySelector('#scrollToTop');
  if (scrollToTop) {
    scrollToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return homeContainer;
};
