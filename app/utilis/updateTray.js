const {
    Menu
} = require('electron'); // eslint-disable-line
const getLights = require('../calls/GET/lights')
const path = require('path');
const imagesDir = path.join(__dirname, '../images/');
const buildApp = require('../buildApp');

module.exports = async (store, tray) => {
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
            tray.setImage(`${imagesDir}/light-on-logo.png`)
        } else {
            tray.setImage(`${imagesDir}/light-off-logo.png`)
        }

    } catch (err) {
        throw new Error(`Error in updateTray: ${err}`);
    }
};