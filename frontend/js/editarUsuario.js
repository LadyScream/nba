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
  multipleStatements: true,
});

// Nos conectamos a la base de datos
conexion.connect();

const name = window.location.href.split('=')[1];

const selectDOM = document.querySelector('#select');
const insertDOM = document.querySelector('#insert');
const grantDOM = document.querySelector('#grant');

// Corre una consulta en la base de datos, que pide los permisos del usuario
// solicitado, si el usuario tiene permisos de tipo SELECT, INSERT o GRANT
// OPTION se mostrarán en la página
conexion.query(`SHOW GRANTS FOR '${name}'`, function(error, results) {
  if (error) throw error;
  const r = results.filter((r) => r[`Grants for ${name}@%`].includes('nba'));
  const perms = r[0][`Grants for ${name}@%`];
  const select = perms.includes('SELECT') || perms.includes('ALL PRIVILEGES');
  selectDOM.checked = select;
  const insert = perms.includes('INSERT') || perms.includes('ALL PRIVILEGES');
  insertDOM.checked = insert;
  const grant =
    perms.includes('GRANT OPTION') || perms.includes('ALL PRIVILEGES');
  grantDOM.checked = grant;
});

const boton = document.querySelector('#editar');
const noti = document.querySelector('#notificacion');

// Añade un evento al botón, cada vez que se haga click en el se revisará el
// estado actual de las variables select, insert y grant para el usuario actual
// y se hará una consulta a la base de datos para actualizar sus permisos
boton.addEventListener('click', () => {
  let query = '';
  query += selectDOM.checked
    ? `GRANT SELECT ON nba.* TO '${name}'@'%'; `
    : `REVOKE SELECT ON nba.* FROM '${name}'@'%'; `;
  query += insertDOM.checked
    ? `GRANT INSERT ON nba.* TO '${name}'@'%'; `
    : `REVOKE INSERT ON nba.* FROM '${name}'@'%'; `;
  query += grantDOM.checked
    ? `GRANT GRANT OPTION ON nba.* TO '${name}'@'%'; `
    : `REVOKE GRANT OPTION ON nba.* FROM '${name}'@'%'; `;
  console.log(query);
  conexion.query(query, function(error) {
    if (error) {
      noti.classList.remove('is-hidden');
      noti.classList.add('is-danger');
      noti.innerText = 'Ocurrió un error';
      throw error;
    }
    noti.classList.remove('is-hidden');
    noti.classList.add('is-primary');
    noti.innerText = 'Se guardó con éxito';
  });
});
