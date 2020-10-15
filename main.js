// Definimos las variables 'app' y 'BrowserWindow' que son parte de Electron
const { app, BrowserWindow } = require('electron');

// Usamos el método 'whenReady' de 'app' para ejecutar una función cuando la
// aplicación este lista para correr.
app.whenReady().then(function() {
  // Creamos una instancia de 'BrowserWindow' donde definimos el tamaño y
  // algunas opciones necesarias por Electron
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  // Quitamos el menú principal de la aplicación, puesto no se utilizará en esta
  win.removeMenu();
  // Cargamos el archivo index.html que se encuentra en el directorio del
  // proyecto, bajo la carpeta frontend, este es el archivo principal donde se
  // ejecutará la aplicación
  win.loadURL(`${__dirname}/frontend/index.html`);
});
