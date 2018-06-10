const fetch = require('node-fetch');

module.exports = async () => {
  console.log('in GETbridge');

  try {
    const endpoint = 'https://www.meethue.com/api/nupnp';
    const response = await fetch(endpoint);
    
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (err) {
    throw new Error(`Error fetching GETBridge: ${err}`);
  }
};