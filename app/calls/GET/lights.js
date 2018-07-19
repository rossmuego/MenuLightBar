const fetch = require('node-fetch');

module.exports = async (bridgeip, username) => {
  console.log('in GETlightss');

  try {

    const endpoint = `http://${bridgeip}/api/${username}/lights`;
    const response = await fetch(endpoint);

    const jsonResponse = await response.json();
   // console.log(jsonResponse)
    return jsonResponse;
  } catch (err) {
    throw new Error(`Error fetching GETlights: ${err}`);
  }
};