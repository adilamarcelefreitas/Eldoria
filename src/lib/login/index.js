import firstLogo from '../../assets/Logo-White.png';
import girl from '../../assets/Composition-Background1.png';
import googleIcon from '../../assets/Google-Logo.png';
import { login, googleLogin } from '../../firebase/firebaseAuth.js';

export default () => {
  document.body.classList.remove('night-mode');
  document.body.classList.remove('background-white');
  document.body.classList.add('login-background');

  const loginContainer = document.createElement('div'); // Cria um elemento div para o contêiner de login.
  loginContainer.classList.add('login-container'); // Adiciona a classe "login-container" ao elemento.

  const content = `
      <main id="container-login">
        <div class="images">
          <section class="header">
            <img src="${firstLogo}" alt="logo-eldoria" class="logo-login"> 
            <p class="subtitle">Dedicado a todos os entusiastas de literatura fantástica</p>
          </section>
          <img src="${girl}" class="img-girl" alt="Desenho de uma menina lendo">
        </div>
        <form class="section-login">
          <h2> Faça login no Eldoria </h2>
          <div class="input-login"> 
          <input type="email" name="email" id="email-login" class="login-email" placeholder="E-mail">  
          <input type="password" name="password" id="key-login" class="login-password" placeholder="Senha"> 
          </div>
          
          <button type="button" class="button-singIn" id="button-login"> Conecte-se </button>
          <p class="text-or">ou</p>
            <button type="button" class="button-google">
              <img src="${googleIcon}" class="icon-google" alt="logo-google"> Faça login com o Google </button>
          <p class="txt-account">Não tem uma conta?</p>
          <a id="btn-register" href ="#register"> Inscrever-se </a>
        </form>
      </main>
    `;

  loginContainer.innerHTML = content; // Insere o conteúdo HTML dentro do contêiner.

  const buttonRegister = loginContainer.querySelector('#btn-register'); // Seleciona o botão de registro.
  buttonRegister.addEventListener('click', () => {
    window.location.hash = '#register'; // Redireciona para a âncora "#register" ao clicar.
  });

  const buttonLogin = loginContainer.querySelector('#button-login'); // Seleciona o botão de login.
  buttonLogin.addEventListener('click', () => {
    const email = loginContainer.querySelector('#email-login'); // Captura o campo de e-mail.
    const password = loginContainer.querySelector('#key-login');
    // window.location.hash = "#home"; // Redireciona para a âncora "#Home" em caso de sucesso.

    login(email.value, password.value)
      .then(() => {
        window.location.hash = '#home'; // Redireciona para a âncora "#Home" em caso de sucesso.
      })
      .catch((error) => {
        if (error.message === 'Firebase: Error (auth/user-not-found).') {
          alert('User not found'); // Exibe um alerta se o usuário não for encontrado.
        } else if (error.message === 'Firebase: Error (auth/wrong-password)') {
          alert('Password not found'); // Exibe um alerta se a senha estiver incorreta.
        }
        console.error(error);
      });
  });

  const googleButton = loginContainer.querySelector('.button-google');
  googleButton.addEventListener('click', () => {
    // alert("botão google ok");
    googleLogin()
      .then(() => {
        window.location.hash = '#home';
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        alert('Erro ao efetuar login com o Google!');
        console.error(error);
      });
  });

  return loginContainer;
};
