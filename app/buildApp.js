const { Menu } = require('electron');
const getLights = require('./calls/GET/lights');
const changeLightState = require('./calls/POST/lightState');

module.exports = async (store, tray) => {
    console.log('in buildApp');
  
    const username = store.get('username');
    const bridgeip = store.get('bridgeip');

    const lights = await getLights(bridgeip, username)
    const lightsMenu = [];

    for (let i = 1; i <= Object.keys(lights).length; i++) {
      lightsMenu.push({
        label: lights[i].name,
        id: 'light_'+i,
        type: 'checkbox',
        checked: lights[i].state.on,
        click(){ changeLightState(i, store, appMenu, tray); }
      })
    }

    const appMenu = Menu.buildFromTemplate([
      {
        label: "Lights",
        submenu: lightsMenu
      }
    ]);
    tray.setContextMenu(appMenu);
  
    console.log('app built!');
  };