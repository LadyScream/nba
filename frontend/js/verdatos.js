const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: '192.168.0.16', // ESTE LO CAMBIAS EN TU CASA
    user: 'juan',
    password: '123',
    database: 'nba'
})

conexion.connect();
console.log('Conectando con base de datos...')
let jugadores;
const selectJugador = document.querySelector('#jugador')
conexion.query('SELECT * FROM jugadores', function(error, results){
    if (error) throw error;
    jugadores = results;
    jugadores.forEach((jugador) => {

        console.log(jugador)
        const option = document.createElement('option')
        option.value = jugador.codigo;
        option.innerText = jugador.Nombre;
        selectJugador.appendChild(option)
    })
});

conexion.end();