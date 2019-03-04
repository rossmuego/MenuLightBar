const fetch = require("node-fetch");

module.exports = async (id, store, refresh) => {
  console.log("in POSTScene");

  try {
    const bridgeip = store.get("bridgeip");
    const username = store.get("username");

    const endpoint = `http://${bridgeip}/api/${username}/groups/0/action`;
    const response = await fetch(endpoint, {
      method: "PUT",
      body: `{"scene": "${id}"}`
    });

    refresh();
  } catch (err) {
    throw new Error(`Error fetching POSTLightState: ${err}`);
  }
};