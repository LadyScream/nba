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
let jugadores;
const selectJugador = document.querySelector('#jugador');

// Hacemos una consulta a la base de datos pidiendo todos los jugadores
conexion.query('SELECT * FROM jugadores', function(error, results) {
  // Si existe un error no ejecuta algo más
  if (error) throw error;

  // Guarda los resultados en la variable jugadores
  jugadores = results;

  // Por cada jugador en la variable jugadores ejecuta una funcion...
  jugadores.forEach((jugador) => {
    // Crea un elemento tipo 'option' que irá dentro de la lista para
    // seleccionar jugadores, que muestra el nombre del jugador
    const option = document.createElement('option');
    option.value = jugador.codigo;
    option.innerText = jugador.Nombre;
    selectJugador.appendChild(option);
  });
});

// Termina la conexión a la base de datos
conexion.end();

// Añadimos un evento de tipo 'change' a la lista de jugadores, que ejecutará
// una función cada vez que se cambie el jugador seleccionado.
selectJugador.addEventListener('change', (e) => {
  // Ejecuta la función 'mostrarEnTabla' con la información del jugador
  // selecionado
  const datos = jugadores.filter(
    (jugador) => jugador.codigo == e.srcElement.value
  );
  mostrarEnTabla(datos);
});

// Guarda el boton con el id #todos en la variable boton
const boton = document.querySelector('#todos');

// Añade un evento de tipo 'click' que mostrará todos los jugadores cuando se
// haga click en el botón
boton.addEventListener('click', () => {
  mostrarEnTabla(jugadores);
});

// Esta función muestra la información de los jugadores que se pasen en un Array
// en la tabla con el id #datos
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
