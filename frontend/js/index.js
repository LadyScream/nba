const Store = require('electron-store');
const mysql = require('mysql');
const store = new Store();

const ip = document.querySelector('#ip');
ip.value = store.get('IP') ? store.get('IP') : '';
store.set('nombre', '');
store.set('contra', '');

const nombre = document.querySelector('#nombre');
const contra = document.querySelector('#contra');

const boton = document.querySelector('#boton');
const noti = document.querySelector('#notificacion');

boton.addEventListener('click', function() {
  const conexion = mysql.createConnection({
    host: ip.value,
    user: nombre.value,
    password: contra.value,
    database: 'nba',
  });

  conexion.connect((error) => {
    if (error) {
      noti.classList.remove('is-hidden');
      noti.classList.add('is-danger');
      noti.innerText = 'Nombre de usuario o contraseña incorrectos';
      throw error;
    } else {
      store.set('IP', ip.value);
      store.set('nombre', nombre.value);
      store.set('contra', contra.value);
      window.location = 'inicio.html';
    }
  });
});
