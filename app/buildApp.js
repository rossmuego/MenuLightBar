const {
  Menu
} = require("electron");
const path = require("path");
const Boolify = require('node-boolify').Boolify;
const imagesDir = path.join(__dirname, "./images");

const getLights = require("./calls/GET/lights");
const getScenes = require("./calls/GET/scenes");
const changeLightState = require("./calls/POST/changeLightState");
const changeScene = require("./calls/POST/changeScene");
const allLights = require("./calls/POST/allLightState");
const lightColor = require("./calls/POST/lightColor");

const buildApp = async (store, tray) => {
  try {
    console.log("in buildApp");

    const username = store.get("username");
    const bridgeIp = store.get("bridgeip");

    const lights = await getLights(bridgeIp, username);
    const lightsMenu = [];

    const scenes = await getScenes(bridgeIp, username);
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
          changeScene(sceneID, store, () => {
            buildApp(store, tray);
          });
        }
      });
    }

    if (lightsOn) {
      tray.setImage(`${imagesDir}/light-on-logo.png`);
    } else {
      tray.setImage(`${imagesDir}/light-off-logo.png`)
    }

    const colourChoices = [{
        label: "White",
        type: "radio",
        click() {
          lightColor("white", lightsList, store, () => {
            buildApp(store, tray);
          });
        }
      },
      {
        label: "Red",
        type: "radio",
        click() {
          lightColor("red", lightsList, store, () => {
            buildApp(store, tray);
          });
        }
      },
      {
        label: "Pink",
        type: "radio",
        click() {
          lightColor("pink", lightsList, store, () => {
            buildApp(store, tray);
          });
        }
      }
    ]

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
        label: "Colors",
        submenu: colourChoices
      }, {
        type: "separator"
      },
      {
        label: "Scenes",
        submenu: scenesMenu
      }, {
        type: "separator"
      },
      {
        label: "Quit",
        role: "quit"
      }
    ]);
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