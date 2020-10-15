// Requerimos los módulos 'electron-store' y 'mysql'
// electron-store es utilizado para guardar la información sobre el usuario, la
// contraseña y la ip del servidor
const Store = require('electron-store');
const mysql = require('mysql');
const store = new Store();

// Creamos una conexión a la base de datos con la información que esta guardada
// en el store
const conexion = mysql.createConnection({
  host: store.get('IP'), // ESTE LO CAMBIAS EN TU CASA
  user: store.get('nombre'),
  password: store.get('contra'),
  database: 'nba',
});

// Guarda los campos necesarios en sus respectivas variables
const nombre = document.querySelector('#nombre');
const contra = document.querySelector('#contra');
const boton = document.querySelector('#boton');
const noti = document.querySelector('#notificacion');

// Añade un evento al botón, cada vez que se haga click en el correra una
// consulta en la base de datos que creará un usuario nuevo con el nombre y la
// contraseña definidos en la página
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
