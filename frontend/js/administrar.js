const Store = require('electron-store');
const mysql = require('mysql');
const store = new Store();

const conexion = mysql.createConnection({
  host: store.get('IP'), // ESTE LO CAMBIAS EN TU CASA
  user: store.get('nombre'),
  password: store.get('contra'),
  database: 'nba',
});

conexion.connect();
let usuarios;

conexion.query('SELECT * FROM mysql.user', function(error, results) {
  if (error) throw error;
  mostrarEnTabla(results.filter((u) => u.User != 'root' && u.User != 'pma'));
});

function mostrarEnTabla(datos) {
  const tabla = document.querySelector('#datos');
  tabla.innerHTML = '';
  datos.forEach((usuario) => {
    const tr = document.createElement('tr');
    const nombre = document.createElement('td');
    nombre.innerText = usuario.User;
    tr.appendChild(nombre);
    const permisos = document.createElement('td');
    conexion.query(`SHOW GRANTS FOR ${usuario.User}`, (error, results) => {
      if (error) throw error;
      const perms = results[1][`Grants for ${usuario.User}@%`];
      const select =
        perms.includes('SELECT') || perms.includes('ALL PRIVILEGES');
      permisos.innerText += select ? ' SELECT, ' : '';
      const insert =
        perms.includes('INSERT') || perms.includes('ALL PRIVILEGES');
      permisos.innerText += insert ? ' INSERT, ' : '';
      const grant =
        perms.includes('GRANT OPTION') || perms.includes('ALL PRIVILEGES');
      permisos.innerText += grant ? ' GRANT OPTION, ' : '';
    });
    tr.appendChild(permisos);
    const acciones = document.createElement('td');
    const botonEditar = document.createElement('a');
    botonEditar.classList.add('button', 'is-primary');
    botonEditar.innerText = 'Editar';
    botonEditar.href = `editarUsuario.html?nombre=${usuario.User}`;
    acciones.appendChild(botonEditar);
    tr.appendChild(acciones);
    tabla.appendChild(tr);
  });
}
