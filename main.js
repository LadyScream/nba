const { app, BrowserWindow } = require('electron');

app.whenReady().then(function() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  win.removeMenu();
  win.loadFile(`${__dirname}/frontend/index.html`);
});
