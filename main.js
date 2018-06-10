const { app, Tray } = require('electron'); // eslint-disable-line
const path = require('path');
const Store = require('electron-store');
const locateBridge = require('./app/utilis/locateBridge')
const imagesDir = path.join(__dirname, '/app/images');

const store = new Store();

if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('ready', async () => {
  // store.clear(); // uncoment to start from scratch
  console.log('starting...');

  try {
    const tray = new Tray(`${imagesDir}/icon.png`);
    if (!store.has('bridgeIP')) {
       locateBridge(store, tray) 
    } else {
        console.log("hi")
    }
  } catch (err) {
    console.log(`Error starting app: ${err}`);
  }
});
