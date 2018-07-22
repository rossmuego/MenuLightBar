const {
    Menu
} = require('electron');
const path = require('path');
const imagesDir = path.join(__dirname, '../images/');
const changeLightState = require('../calls/POST/changeLightState')
const allLights = require('../calls/POST/allLightState');
const getLights = require('../calls/GET/lights')

exports.updateTray = async (store, tray) => {
    try {
        console.log('checking tray image');
        let lightsOn = false;
        const bridgeip = store.get('bridgeip');
        const username = store.get('username');

        const lights = await getLights(bridgeip, username)

        for (var light in lights) {
            let i = parseInt(light)
            var curr = lights[light];
            if (curr.state.on) {
                lightsOn = true;
            }
        }

        console.log(lightsOn)

        if (lightsOn) {
            tray.setImage(`${imagesDir}/light-on-logo.png`)
        } else {
            tray.setImage(`${imagesDir}/light-off-logo.png`)
        }

        console.log('starting menu rebuild');

        const lightsMenu = [];

        let indvLightsOn = false;
        let lightsList = [];

        for (var light in lights) {
            let i = parseInt(light)
            lightsList.push(i);
            var curr = lights[light];
            if (curr.state.on) {
                indvLightsOn = true;
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

        const appMenu = Menu.buildFromTemplate([{
                label: 'On',
                checked: indvLightsOn,
                type: 'radio',
                click() {
                    allLights(store, tray, lightsList, true)
                }
            },
            {
                label: 'Off',
                checked: !indvLightsOn,
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

        console.log('menu rebuilt!');
    } catch (err) {
        throw new Error(`Error in UpdateTray: ${err}`);
    }
};