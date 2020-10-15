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
let equiposDisponibles;
const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const procedencia = document.querySelector('#procedencia');
const altura = document.querySelector('#altura');
const peso = document.querySelector('#peso');
const posicion = document.querySelector('#posicion');
const equipo = document.querySelector('#equipo');

// Inicia conexión con la base de datos
conexion.connect();

// Corre una consulta en la base de datos pidiendo todos los equipos
// y añade el nombre de los equipos a la lista de equipos disponibles que se
// muestra en la página
conexion.query('SELECT * FROM equipos', function(error, results) {
  if (error) throw error;
  equiposDisponibles = results;
  equiposDisponibles.forEach((equi) => {
    const option = document.createElement('option');
    option.value = equi.Nombre;
    option.innerText = equi.Nombre;
    equipo.appendChild(option);
  });
});

const boton = document.querySelector('#boton');
const noti = document.querySelector('#notificacion');

// Cuando se da click al botón corre una consulta que añade un jugador con la
// información que se entró en la página
boton.addEventListener('click', (e) => {
  e.preventDefault();
  const query = `INSERT INTO \`jugadores\` (\`codigo\`, \`Nombre\`, \`Procedencia\`, \`Altura\`, \`Peso\`, \`Posicion\`, \`Nombre_equipo\`) VALUES ('${codigo.value}', '${nombre.value}', '${procedencia.value}', '${altura.value}', '${peso.value}', '${posicion.value}', '${equipo.value}')`;
  conexion.query(query, (error, results) => {
    if (error) {
      noti.classList.remove('is-hidden');
      noti.classList.add('is-danger');
      noti.innerText = 'Ocurrió un error';
      throw error;
    }
    noti.classList.remove('is-hidden');
    noti.classList.add('is-primary');
    noti.innerText = 'Se guardó con éxito';
    codigo.value = '';
    nombre.value = '';
    procedencia.value = '';
    altura.value = '';
    peso.value = '';
    posicion.value = '';
    equipo.value = '';
  });
});
