const Store = require('electron-store');
const mysql = require('mysql');
const store = new Store();

const conexion = mysql.createConnection({
  host: store.get('IP'), // ESTE LO CAMBIAS EN TU CASA
  user: store.get('nombre'),
  password: store.get('contra'),
  database: 'nba',
});

const nombre = document.querySelector('#nombre');
const contra = document.querySelector('#contra');
const boton = document.querySelector('#boton');
const noti = document.querySelector('#notificacion');

boton.addEventListener('click', (e) => {
  e.preventDefault();
  const query = `CREATE USER '${nombre.value}'@'%' IDENTIFIED BY '${contra.value}'`;
  conexion.query(query, (error) => {
    if (error) {
      noti.classList.remove('is-hidden');
      noti.classList.add('is-danger');
      noti.innerText = 'Ocurrió un error';
      throw error;
    }
    noti.classList.remove('is-hidden');
    noti.classList.add('is-primary');
    noti.innerText = 'Se guardó con éxito';
    nombre.value = '';
    contra.value = '';
  });
});
