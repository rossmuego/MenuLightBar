const {
  Menu
} = require('electron');
const getLights = require('./calls/GET/lights');
const changeLightState = require('./calls/POST/lightState');
const path = require('path');
const imagesDir = path.join(__dirname, './images');
const allLights = require('./calls/POST/allLightState');

const buildApp = async (store, tray) => {
  console.log('in buildApp');

  const username = store.get('username');
  const bridgeip = store.get('bridgeip');

  const lights = await getLights(bridgeip, username)
  const lightsMenu = [];

  let lightsOn = false;
  let lightsList = [];

  for (var light in lights) {
    let i = parseInt(light)
    lightsList.push(i);
    var curr = lights[light];
    if (curr.state.on) {
      lightsOn = true;
    }
    lightsMenu.push({
      label: curr.name,
      id: light,
      type: 'checkbox',
      checked: curr.state.on,
      click() {
        changeLightState(i, store, tray);
      }
    })
  }

//  console.log(lightsList)

  if (lightsOn) {
    tray.setImage(`${imagesDir}/light-on-logo.png`)
  }

  const appMenu = Menu.buildFromTemplate([{
      label: 'On',
      checked: lightsOn,
      type: 'radio',
      click() {
        allLights(store, tray, lightsList, true)
      }
    },
    {
      label: 'Off',
      checked: !lightsOn,
      type: 'radio',
      click() {
        allLights(store, tray, lightsList, false)
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

module.exports = async (store, tray) => {
  buildApp(store, tray);
  setInterval(buildApp, 30000, store, tray);
};