const { Menu } = require('electron'); // eslint-disable-line
const bridgeIP = require('../calls/GET/bridge_ip')
module.exports = (store, tray) => {
    console.log('in login');
  
    // clear store incase of errors
  
    const loginMenu = Menu.buildFromTemplate([
      { label: 'Find Bridge', click() { bridgeIP(store, tray); } },
      { type: 'separator' },
      { label: 'Quit', role: 'quit' },
    ]);
    tray.setContextMenu(loginMenu);
  };