const fetch = require('node-fetch');
const {
    Menu
} = require('electron');
var updateTray = require('../../utilis/updateTray')

exports.changeScene = async (id, store, tray) => {
    console.log('in POSTScene');

    try {

        const bridgeip = store.get('bridgeip')
        const username = store.get('username')

        const endpoint = `http://${bridgeip}/api/${username}/groups/0/action`;
        const response = await fetch(endpoint, {
            method: 'PUT',
            body: `{"scene": "${id}"}`,
        });

        updateTray.updateTray(store, tray);

    } catch (err) {
        throw new Error(`Error fetching POSTLightState: ${err}`);
    }

};