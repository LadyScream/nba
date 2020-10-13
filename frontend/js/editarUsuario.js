const Store = require('electron-store');
const mysql = require('mysql');
const store = new Store();

const conexion = mysql.createConnection({
  host: store.get('IP'), // ESTE LO CAMBIAS EN TU CASA
  user: store.get('nombre'),
  password: store.get('contra'),
  database: 'nba',
  multipleStatements: true,
});

conexion.connect();

const name = window.location.href.split('=')[1];

const selectDOM = document.querySelector('#select');
const insertDOM = document.querySelector('#insert');
const grantDOM = document.querySelector('#grant');

conexion.query(`SHOW GRANTS FOR '${name}'`, function(error, results) {
  if (error) throw error;
  const perms = results[1][`Grants for ${name}@%`];
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
