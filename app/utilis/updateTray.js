const {
    Menu
} = require('electron'); // eslint-disable-line
const getLights = require('../calls/GET/lights')
const path = require('path');
const imagesDir = path.join(__dirname, '../images/');

module.exports = async (store, tray) => {
    console.log('checking tray image');
    let lightsOn = false;
    const bridgeip = store.get('bridgeip');
    const username = store.get('username');
    // clear store incase of errors
    const lights = await getLights(bridgeip, username)
    for (let i = 1; i <= Object.keys(lights).length; i++) {
        if (lights[i].state.on) {
            lightsOn = true;
        }
    }

    if (lightsOn) {
        tray.setImage(`${imagesDir}/icon-on.png`)
    } else {
        tray.setImage(`${imagesDir}/icon.png`)
    }

};