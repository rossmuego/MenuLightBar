const {
    Menu
} = require('electron');
const path = require('path');
const imagesDir = path.join(__dirname, '../images/');
const changeLightState = require('../calls/POST/changeLightState');
const changeScene = require('../calls/POST/changeScene');
const allLights = require('../calls/POST/allLightState');
const getLights = require('../calls/GET/lights');
const getScenes = require('../calls/GET/scenes');

exports.updateTray = async (store, tray) => {
    try {
        console.log('in buildApp');

        const username = store.get('username');
        const bridgeip = store.get('bridgeip');

        const lights = await getLights(bridgeip, username);
        const lightsMenu = [];

        const scenes = await getScenes(bridgeip, username);
        const scenesMenu = [];

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
                    changeLightState.changeLightState(i, store, tray);
                }
            })
        }

        for (var scene in scenes) {
            let sceneID = scene;
            var curr = scenes[scene];
            scenesMenu.push({
                label: curr.name,
                type: 'checkbox',
                click() {
                    changeScene.changeScene(sceneID, store, tray);
                }
            })
        }


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
                label: "Scenes",
                submenu: scenesMenu
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

        console.log('menu rebuilt!');
    } catch (err) {
        throw new Error(`Error in UpdateTray: ${err}`);
    }
};