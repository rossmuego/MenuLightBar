const fetch = require('node-fetch');

module.exports = async (bridgeip, username) => {
    console.log('in GETscenes');

    try {
        const endpoint = `http://${bridgeip}/api/${username}/scenes`;
        const response = await fetch(endpoint);

        const jsonResponse = await response.json();
//        console.log(jsonResponse)
        return jsonResponse;
    } catch (err) {
        throw new Error(`Error fetching GETscenes: ${err}`);
    }
};