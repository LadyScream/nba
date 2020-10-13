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

const name = store.get('nombre');
let select, insert, grant;
const selectDOM = document.querySelector('#select');
const insertDOM = document.querySelector('#insert');
const grantDOM = document.querySelector('#grant');

conexion.query(`SHOW GRANTS FOR '${name}'`, function(error, results) {
  if (error) throw error;
  const perms = results[1][`Grants for ${name}@%`];
  select = perms.includes('SELECT') || perms.includes('ALL PRIVILEGES');
  insert = perms.includes('INSERT') || perms.includes('ALL PRIVILEGES');
  grant = perms.includes('GRANT OPTION') || perms.includes('ALL PRIVILEGES');
  if (select) selectDOM.classList.remove('is-hidden');
  if (insert) insertDOM.classList.remove('is-hidden');
  if (grant) grantDOM.classList.remove('is-hidden');
});
