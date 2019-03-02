const {
  Menu,
  app
} = require("electron");
const Boolify = require('node-boolify').Boolify;
const getLights = require("./calls/GET/lights");
const getScenes = require("./calls/GET/scenes");
const changeLightState = require("./calls/POST/changeLightState");
const changeScene = require("./calls/POST/changeScene");
const path = require("path");
const imagesDir = path.join(__dirname, "./images");
const allLights = require("./calls/POST/allLightState");

const buildApp = async (store, tray) => {
  try {
    console.log("in buildApp");

    const username = store.get("username");
    const bridgeip = store.get("bridgeip");

    const lights = await getLights(bridgeip, username);
    const lightsMenu = [];

    const scenes = await getScenes(bridgeip, username);
    const scenesMenu = [];

    let lightsOn = false;
    let lightsList = [];

    for (var light in lights) {
      let lightId = parseInt(light);
      lightsList.push(lightId);
      var curr = lights[lightId];

      if (Boolify(curr.state.on)) {
        lightsOn = true;
      }

      lightsMenu.push({
        label: curr.name,
        id: lightId,
        type: "checkbox",
        checked: curr.state.on,
        click(light) {
          changeLightState(light, store, () =>
            buildApp(store, tray)
          );
        }
      });
    }

    for (var scene in scenes) {
      let sceneID = scene;
      var curr = scenes[scene];
      scenesMenu.push({
        label: curr.name,
        type: "radio",
        click() {
          changeScene.changeScene(sceneID, store, tray);
        }
      });
    }

    if (lightsOn) {
      tray.setImage(`${imagesDir}/light-on-logo.png`);
    } else {
      tray.setImage(`${imagesDir}/light-off-logo.png`)
    }

    const appMenu = Menu.buildFromTemplate([{
      label: "On",
      checked: lightsOn,
      type: "radio",
      click() {
        allLights(store, lightsList, true, () => {
          buildApp(store, tray)
        });
      }
    }, {
      label: "Off",
      checked: !lightsOn,
      type: "radio",
      click() {
        allLights(store, lightsList, false, () => {
          buildApp(store, tray)
        });
      }
    }, {
      type: "separator"
    }, {
      label: "Lights",
      submenu: lightsMenu
    }, {
      type: "separator"
    }, {
      label: "Scenes",
      submenu: scenesMenu
    }, {
      type: "separator"
    }, {
      type: "separator"
    }, {
      label: "Options",
      submenu: [{
        label: `Version: ${app.getVersion()}`,
        enabled: false
      }]
    }, {
      label: "Quit",
      role: "quit"
    }]);
    tray.setContextMenu(appMenu);

    console.log("app built!");
  } catch (err) {
    throw new Error(`Error in buildapp: ${err}`);
  }
};

module.exports = async (store, tray) => {
  buildApp(store, tray);
  setInterval(buildApp, 30000, store, tray);
};