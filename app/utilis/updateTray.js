const {
    Menu
} = require('electron'); // eslint-disable-line
const getLights = require('../calls/GET/lights')
const path = require('path');
const imagesDir = path.join(__dirname, '../images/');
const allLights = require('../calls/POST/allLightState');

exports.update = async (store, tray) => {
    try {
        console.log('checking tray image');
        let lightsOn = false;
        const bridgeip = store.get('bridgeip');
        const username = store.get('username');
        // clear store incase of errors
        const lights = await getLights(bridgeip, username)

        for (var light in lights) {
            let i = parseInt(light)
            var curr = lights[light];
            if (curr.state.on) {
                lightsOn = true;
            }
        }

        if (lightsOn) {
            tray.setImage(`${imagesDir}/icon-on.png`)
        } else {
            tray.setImage(`${imagesDir}/icon.png`)
        }

        rebuildMenu(store, tray, lights);
        return 'successs';

    } catch (err) {
        throw new Error(`Error in updateTray: ${err}`);
    }
};


function rebuildMenu(store, tray, lights) {
    console.log('in rebuildmenu');
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
        tray.setImage(`${imagesDir}/icon-on.png`)
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

    console.log('menu rebuilt!');
};
