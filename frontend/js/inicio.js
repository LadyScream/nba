// Requerimos los módulos 'electron-store' y 'mysql'
// electron-store es utilizado para guardar la información sobre el usuario, la
// contraseña y la ip del servidor
const Store = require('electron-store');
const mysql = require('mysql');
const store = new Store();

// Creamos una conexión a la base de datos con la información que esta guardada
// en el store
const conexion = mysql.createConnection({
  host: store.get('IP'),
  user: store.get('nombre'),
  password: store.get('contra'),
  database: 'nba',
  multipleStatements: true,
});

// Nos conectamos a la base de datos
conexion.connect();

// Guardamos el nombre del usuario en la variable name
const name = store.get('nombre');

// Definimos unas variables para guardar los permisos del usuario
let select, insert, grant;
const selectDOM = document.querySelector('#select');
const insertDOM = document.querySelector('#insert');
const grantDOM = document.querySelector('#grant');

// Corremos una consulta en la base de datos donde pedimos los permisos del
// usuario actual
conexion.query(`SHOW GRANTS FOR '${name}'`, function(error, results) {
  // Si hay un error nos lo marca
  if (error) throw error;

  // Guardamos la cadena con los permisos en la variable 'perms'
  const perms = results[1][`Grants for ${name}@%`];

  // Si la cadena guardada en perms contiene la palabra SELECT o ALL PRIVILEGES
  // el usuario tiene permisos para usar el select y se guarda en la variable
  // select, lo mismo se hace con INSERT y GRANT OPTION
  select = perms.includes('SELECT') || perms.includes('ALL PRIVILEGES');
  insert = perms.includes('INSERT') || perms.includes('ALL PRIVILEGES');
  grant = perms.includes('GRANT OPTION') || perms.includes('ALL PRIVILEGES');

  // Checamos los valores de las variables para ver si el usuario tiene
  // permisos, si los tiene se muestran los botones correspondientes
  if (select) selectDOM.classList.remove('is-hidden');
  if (insert) insertDOM.classList.remove('is-hidden');
  if (grant) grantDOM.classList.remove('is-hidden');
});
