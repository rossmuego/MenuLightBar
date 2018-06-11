const fetch = require('node-fetch');
const {
    Menu
} = require('electron');
const updateTray = require('../../utilis/updateTray')

module.exports = async (store, tray, totalLights, state) => {
    console.log('in POSTlights');

    try {
        const bridgeip = store.get('bridgeip')
        const username = store.get('username')

        for (let i = 1; i <= totalLights; i++) {
            const endpoint = `http://${bridgeip}/api/${username}/lights/${i}/state`;
            const response = await fetch(endpoint, {
                method: 'PUT',
                body: `{"on":${state}, "transitiontime":"2"}`,
            });
        }

        updateTray(store, tray);

    } catch (err) {
        throw new Error(`Error fetching GETlights: ${err}`);
    }
};