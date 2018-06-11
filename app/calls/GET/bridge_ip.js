const fetch = require('node-fetch');
const getUsername = require('../POST/getUsername');

module.exports = async (store, tray) => {
  console.log('in GETbridge');

  store.clear();

  try {
    const endpoint = 'https://www.meethue.com/api/nupnp';
    const response = await fetch(endpoint);
    
    const jsonResponse = await response.json();

    getUsername(jsonResponse, store, tray)
   
  } catch (err) {
    throw new Error(`Error fetching GETBridge: ${err}`);
  }
};