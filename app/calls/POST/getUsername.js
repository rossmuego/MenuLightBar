const fetch = require('node-fetch');
const buildApp = require('../../buildApp');

module.exports = async (ipresponse, store, tray) => {
  console.log('in POSTaccessToken');

  try {

    const response = await fetch(
      "http://" + ipresponse[0].internalipaddress + "/api", {
        method: 'POST',
        body: '{"devicetype":"my_hue_app#iphone peter"}'
      },
    );

    const jsonResponse = await response.json();
    console.log(jsonResponse.success.username)
    store.set('username', "igsjuyuvRT9rXTm0IJvEhPh2so-4GFo6pR5Vkudj")
    store.set('bridgeip', ipresponse[0].internalipaddress)

    buildApp(store, tray);

  } catch (err) {
    throw new Error(`Error in getAccessToken: ${err}`);
  }
};