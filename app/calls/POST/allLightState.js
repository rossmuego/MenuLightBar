const fetch = require("node-fetch");
const { Menu } = require("electron");
var updateTray = require("../../utilis/updateTray");

module.exports = async (store, tray, lightsList, state) => {
  console.log("in POSTlights");

  try {
    const bridgeip = store.get("bridgeip");
    const username = store.get("username");
    for (let i = 0; i < lightsList.length; i++) {
      let light = lightsList[i];
      const endpoint = `http://${bridgeip}/api/${username}/lights/${light}/state`;
      const response = await fetch(endpoint, {
        method: "PUT",
        body: `{"on":${state}, "transitiontime":"2"}`
      });
    }

    updateTray.updateTray(store, tray);
  } catch (err) {
    throw new Error(`Error fetching POSTAllLights: ${err}`);
  }
};
