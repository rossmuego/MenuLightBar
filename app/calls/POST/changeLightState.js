const fetch = require("node-fetch");
var updateTray = require("../../utilis/updateTray");

exports.changeLightState = async (id, store, tray, state) => {
  console.log("in POSTlights");

  try {
    const bridgeip = store.get("bridgeip");
    const username = store.get("username");

    const endpoint = `http://${bridgeip}/api/${username}/lights/${id}/state`;
    const response = await fetch(endpoint, {
      method: "PUT",
      body: `{"on": ${!state}}`
    });

    updateTray.updateTray(store, tray);
  } catch (err) {
    throw new Error(`Error fetching POSTLightState: ${err}`);
  }
};
