const Store = require('electron-store');
const mysql = require('mysql');
const store = new Store();

const conexion = mysql.createConnection({
  host: store.get('IP'), // ESTE LO CAMBIAS EN TU CASA
  user: store.get('nombre'),
  password: store.get('contra'),
  database: 'nba',
});

let equiposDisponibles;
const codigo = document.querySelector('#codigo');
const nombre = document.querySelector('#nombre');
const procedencia = document.querySelector('#procedencia');
const altura = document.querySelector('#altura');
const peso = document.querySelector('#peso');
const posicion = document.querySelector('#posicion');
const equipo = document.querySelector('#equipo');

conexion.connect();

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
