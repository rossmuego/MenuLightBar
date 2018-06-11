const {
  app,
  Tray
} = require('electron'); // eslint-disable-line
const path = require('path');
const Store = require('electron-store');
const locateBridge = require('./app/utilis/locateBridge')
const imagesDir = path.join(__dirname, '/app/images');
const buildApp = require('./app/buildApp');

const store = new Store();

if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('ready', async () => {
  // store.clear(); // uncoment to start from scratch
  console.log('starting...');

  try {
    const tray = new Tray(`${imagesDir}/icon.png`);
    if (!store.has('bridgeip')) {
      locateBridge(store, tray)
    } else {
      buildApp(store, tray);
    }
  } catch (err) {
    console.log(`Error starting app: ${err}`);
  }
});