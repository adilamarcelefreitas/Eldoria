import firstLogoBlue from '../../assets/Logo-blue.png';
import { newPost } from "../../firebase/firebaseStore";

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
            <li><a href=""><i class='fa-solid fa-arrow-right-from-bracket'></i></a><span class='menu-text'>Sair</span></li>
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
      </main>
      <footer class='footer-home'>
      
        <div class='new-post'>
          <i class="fa-solid fa-plus"></i>
        </div>
      </footer>
    `;

    homeContainer.innerHTML = content; // Insere o conteúdo HTML dentro do contêiner.

    document.body.classList.add('background-white');

    const menuIcon = homeContainer.querySelector('#menu-icon');
    const menuItems = homeContainer.querySelector('.menu-items');

    function menuShow() {
        menuItems.classList.toggle("open");
        menuIcon.style.display = 'none';
    }

    menuIcon.addEventListener('click', menuShow);

    //função para o botão do modo noturno

    let isNightMode = false;

    const toggleButtonOn = homeContainer.querySelector('#toggle-on');
    const toggleButtonOff = homeContainer.querySelector('#toggle-off');
    
    function toggleNightMode() {
      const body = document.body;
    
      if (isNightMode) {
        // Desativar o modo noturno
        body.classList.remove('night-mode');
        toggleButtonOn.style.display = 'block'; 
        toggleButtonOff.style.display = 'none'; 
        isNightMode = false;
      } else {
        // Ativar o modo noturno
        body.classList.add('night-mode');
        toggleButtonOn.style.display = 'none'; 
        toggleButtonOff.style.display = 'block'; 
        isNightMode = true;
      }
    }
    
    if (isNightMode) {
      toggleButtonOn.style.display = 'none'; 
    } else {
      toggleButtonOff.style.display = 'none'; 
    }
    
    toggleButtonOn.addEventListener('click', toggleNightMode);
    toggleButtonOff.addEventListener('click', toggleNightMode);

    //fim da função

    return homeContainer;
}