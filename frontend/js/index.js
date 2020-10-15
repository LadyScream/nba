// Requerimos los módulos 'electron-store' y 'mysql'
// electron-store es utilizado para guardar la información sobre el usuario, la
// contraseña y la ip del servidor
const Store = require('electron-store');
const mysql = require('mysql');

// Creamos una instancia de Store
const store = new Store();

// De la ventana principal obtenemos el campo con el id #ip y lo guardamos en la
// variable ip
const ip = document.querySelector('#ip');
// Si hay una ip guardada en el store, la ponemos en el campo, de lo contrario
// ponemos una cadena vacia
ip.value = store.get('IP') ? store.get('IP') : '';

// Definimos el usuario y la contraseña como vacios en el store, esto para
// evitar que se pueda iniciar sesión sin entrar los datos correctos
store.set('nombre', '');
store.set('contra', '');

// Obtenemos los campos #nombre y #contra y los guardamos en sus respectivas
// variables
const nombre = document.querySelector('#nombre');
const contra = document.querySelector('#contra');

// Obtenemos el boton con el id #boton y el espacio donde irán notificaciones
// con el id #notificacion
const boton = document.querySelector('#boton');
const noti = document.querySelector('#notificacion');

// Añadimos un evento de tipo 'click' al boton, esto quiere decir que cuando se
// haga click en dicho botón se ejecutará la función definida
boton.addEventListener('click', function() {
  // Creamos una conexión a la base de datos, utilizando los valores de los
  // campos ip, nombre y contra
  const conexion = mysql.createConnection({
    host: ip.value,
    user: nombre.value,
    password: contra.value,
    database: 'nba',
  });

  // Probamos la conexión
  conexion.connect((error) => {
    // Si existe un error...
    if (error) {
      // Mostramos una notificación que dice que la contraseña o el usuario es
      // incorrecto
      noti.classList.remove('is-hidden');
      noti.classList.add('is-danger');
      noti.innerText = 'Nombre de usuario o contraseña incorrectos';
      throw error;
    } else {
      // De lo contrario guardamos la información en el store y vamos a la
      // página inicio.html
      store.set('IP', ip.value);
      store.set('nombre', nombre.value);
      store.set('contra', contra.value);
      window.location = 'inicio.html';
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.which === 123) {
    require('electron')
      .remote.getCurrentWindow()
      .toggleDevTools();
  }
});

