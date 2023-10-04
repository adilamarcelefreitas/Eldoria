import login from './lib/login/index.js';
import home from './lib/home/index.js';
import register from './lib/register/index.js';

const main = document.querySelector('#root');
async function hashVerification() {
  main.innerHTML = '';
  switch (window.location.hash) {
    case '':
      main.appendChild(login());
      break;
    case '#register':
      main.appendChild(register());
      break;
    case '#home':
      main.appendChild(await home());
      break;
    default:
      main.appendChild(login());
      break;
  }
}
const init = () => {
  window.addEventListener('hashchange', async () => {
    await hashVerification();
  });
};

window.addEventListener('load', async () => {
  await hashVerification();
  init();
});
