const fetch = require('node-fetch');
const updateLights = require('../GET/lights');
const { Menu } = require('electron');

module.exports = async (id, store, menu, tray) => {
  console.log('in POSTlights');

  try {
    const bridgeip = store.get('bridgeip')
    const username = store.get('username')

    const menu = Menu.getApplicationMenu()
    const state = menu.items[0].submenu.items[id-1].checked

    const endpoint = `http://${bridgeip}/api/${username}/lights/${id}/state`;
    const response = await fetch(endpoint, {
        method: 'PUT', body: `{"on":${!state}}`
    });

    menu.items[0].submenu.items[id-1].checked = !state
    Menu.setApplicationMenu(menu);

} catch (err) {
    throw new Error(`Error fetching GETlights: ${err}`);
  }

};