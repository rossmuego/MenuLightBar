const {
  Menu,
  Tray
} = require('electron');
const getLights = require('./calls/GET/lights');
const changeLightState = require('./calls/POST/lightState');
const path = require('path');
const imagesDir = path.join(__dirname, './images');
const allLights = require('./calls/POST/allLightState');

module.exports = async (store, tray) => {
  console.log('in buildApp');

  const username = store.get('username');
  const bridgeip = store.get('bridgeip');

  const lights = await getLights(bridgeip, username)
  const lightsMenu = [];
  let lightsOn = false;
  const totalLights = Object.keys(lights).length;
  for (let i = 1; i <= totalLights; i++) {
    if (lights[i].state.on) {
      lightsOn = true;
    }
    lightsMenu.push({
      label: lights[i].name,
      id: 'light_' + i,
      type: 'checkbox',
      checked: lights[i].state.on,
      click() {
        changeLightState(i, store, tray);
      }
    })
  }

  if (lightsOn) {
    tray.setImage(`${imagesDir}/icon-on.png`)
  }

  const appMenu = Menu.buildFromTemplate([
    {
      label: 'On',
      checked: lightsOn,
      type: 'radio',
      click(){
        allLights(store, tray, totalLights, true)
      }
    },
    {
      label: 'Off',
      checked: !lightsOn,
      type: 'radio',
      click(){
        allLights(store, tray, totalLights, false)
      }
    },
    {
      type: 'separator'
    },
    {
      label: "Lights",
      submenu: lightsMenu
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      role: 'quit'
    },
  ]);
  tray.setContextMenu(appMenu);

  console.log('app built!');
};