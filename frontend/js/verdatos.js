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
let jugadores;
const selectJugador = document.querySelector('#jugador');
conexion.query('SELECT * FROM jugadores', function(error, results) {
  if (error) throw error;
  jugadores = results;
  jugadores.forEach((jugador) => {
    const option = document.createElement('option');
    option.value = jugador.codigo;
    option.innerText = jugador.Nombre;
    selectJugador.appendChild(option);
  });
});

conexion.end();

selectJugador.addEventListener('change', (e) => {
  const datos = jugadores.filter(
    (jugador) => jugador.codigo == e.srcElement.value
  );
  mostrarEnTabla(datos);
});

const boton = document.querySelector('#todos');
boton.addEventListener('click', () => {
  mostrarEnTabla(jugadores);
});

function mostrarEnTabla(datos) {
  const tabla = document.querySelector('#datos');
  tabla.innerHTML = '';
  datos.forEach((jugador) => {
    const tr = document.createElement('tr');
    const codigo = document.createElement('td');
    codigo.innerText = jugador.codigo;
    tr.appendChild(codigo);
    const nombre = document.createElement('td');
    nombre.innerText = jugador.Nombre;
    tr.appendChild(nombre);
    const procedencia = document.createElement('td');
    procedencia.innerText = jugador.Procedencia;
    tr.appendChild(procedencia);
    const altura = document.createElement('td');
    altura.innerText = jugador.Altura;
    tr.appendChild(altura);
    const peso = document.createElement('td');
    peso.innerText = jugador.Peso;
    tr.appendChild(peso);
    const posicion = document.createElement('td');
    posicion.innerText = jugador.Posicion;
    tr.appendChild(posicion);
    const nombreEquipo = document.createElement('td');
    nombreEquipo.innerText = jugador.Nombre_equipo;
    tr.appendChild(nombreEquipo);
    tabla.appendChild(tr);
  });
}
