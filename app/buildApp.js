const {
  Menu
} = require('electron');
const getLights = require('./calls/GET/lights');
const changeLightState = require('./calls/POST/lightState');
const path = require('path');
const imagesDir = path.join(__dirname, './images');
const allLights = require('./calls/POST/allLightState');
const getScenes = require('./calls/GET/scenes')

module.exports = async (store, tray) => {
  console.log('in buildApp');

  const username = store.get('username');
  const bridgeip = store.get('bridgeip');

  const scenes = await getScenes(bridgeip, username)
  const lights = await getLights(bridgeip, username)
  const lightsMenu = [];
  const scenesMenu = [];

  let lightsOn = false;
  const totalLights = Object.keys(lights).length;
  const totalScenes = Object.keys(scenes).length
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

  for (let i = 1; i <= totalScenes; i++) {
    scenesMenu.push({
      label: 'hi',
      type: 'radio',
      checked: false,
      click() {
        changeLightState(i, store, tray);
      }
    })
  }
  const appMenu = Menu.buildFromTemplate([{
      label: 'On',
      checked: lightsOn,
      type: 'radio',
      click() {
        allLights(store, tray, totalLights, true)
      }
    },
    {
      label: 'Off',
      checked: !lightsOn,
      type: 'radio',
      click() {
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
      label: "Scenes",
      submenu: scenesMenu
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