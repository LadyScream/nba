const { TouchBarLabel } = require('electron');
const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: '192.168.0.16', // ESTE LO CAMBIAS EN TU CASA
    user: 'juan',
    password: '123',
    database: 'nba'
})

conexion.connect();
let jugadores;
const selectJugador = document.querySelector('#jugador')
conexion.query('SELECT * FROM jugadores', function(error, results){
    if (error) throw error;
    jugadores = results;
    jugadores.forEach((jugador) => {
        const option = document.createElement('option')
        option.value = jugador.codigo;
        option.innerText = jugador.Nombre;
        selectJugador.appendChild(option)
    })
});

conexion.end();

selectJugador.addEventListener('change', (e) => {
    console.log(e)
})

function mostrarEnTabla(datos) {
    const tabla = document.querySelector('datos')
    datos.forEach((jugador) => {
        const tr = document.createElement('tr');
        tr.appendChild(
            document.createElement('td').innerText = jugador.Nombre
        );
        tabla.appendChild(tr);
    })
}