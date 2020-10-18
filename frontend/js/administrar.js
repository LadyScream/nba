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

// Nos conectamos a la base de datos
conexion.connect();
let usuarios;

// Corre una consulta en la base de datos que pide todos los usuarios
// disponibles, y despues muestra los usuarios que no son 'root' o 'pma' en la
// tabla usando la función 'mostrarEnTabla'
conexion.query('SELECT * FROM mysql.user', function(error, results) {
  if (error) throw error;
  mostrarEnTabla(results.filter((u) => u.User != 'root' && u.User != 'pma'));
});

// Esta función como tal da formato a la información de los usuarios y la
// muestra en la tabla
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
      const r = results.filter((r) =>
        r[`Grants for ${usuario.User}@%`].includes('nba')
      );
      const perms = r[0][`Grants for ${usuario.User}@%`];
      console.log(r);
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
