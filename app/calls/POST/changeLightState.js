const fetch = require("node-fetch");
var Boolify = require('node-boolify').Boolify;

module.exports = async (light, store, reload) => {
  console.log("in POSTlights");
  try {
    // console.log(light);
    const bridgeip = store.get("bridgeip");
    const username = store.get("username");

    const endpoint = `http://${bridgeip}/api/${username}/lights/${light.id}/state`;
    const response = await fetch(endpoint, {
      method: "PUT",
      body: `{"on": ${Boolify(light.checked)}}`
    });

    reload();
  } catch (err) {
    throw new Error(`Error fetching POSTLightState: ${err}`);
  }
};