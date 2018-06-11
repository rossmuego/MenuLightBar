const fetch = require('node-fetch');
const {
    Menu
} = require('electron');
const updateTray = require('../../utilis/updateTray')

module.exports = async (id, store, tray) => {
    console.log('in POSTlights');

    try {
        const bridgeip = store.get('bridgeip')
        const username = store.get('username')

        const menu = Menu.getApplicationMenu()
        const state = menu.items[0].submenu.items[id - 1].checked;
        menu.items[0].submenu.items[id - 1].checked = !state
        Menu.setApplicationMenu(menu);

        const endpoint = `http://${bridgeip}/api/${username}/lights/${id}/state`;
        const response = await fetch(endpoint, {
            method: 'PUT',
            body: `{"on":${!state}, "transitiontime":"2"}`,
        });

        updateTray(store, tray);

    } catch (err) {
        throw new Error(`Error fetching GETlights: ${err}`);
    }

};