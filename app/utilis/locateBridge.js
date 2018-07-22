const {
  Menu
} = require('electron');
const bridgeIP = require('../calls/GET/bridge_ip')
module.exports = (store, tray) => {
  console.log('in login');

  const loginMenu = Menu.buildFromTemplate([{
      label: 'Find Bridge',
      click() {
        bridgeIP(store, tray);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      role: 'quit'
    },
  ]);
  tray.setContextMenu(loginMenu);
};