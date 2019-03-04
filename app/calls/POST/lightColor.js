const fetch = require("node-fetch");
const lightColours = {
  "red": 0,
  "orange": 8500,
  "yellow": 17000,
  "green": 25500,
  "white": 34000,
  "blue": 46920,
  "purple": 48000,
  "magenta": 54000,
  "pink": 60000
}

module.exports = async (color, lightsList, store, reload) => {
  console.log("in ChangeLightColor");

  try {
    const bridgeip = store.get("bridgeip");
    const username = store.get("username");

    for (let i = 0; i < lightsList.length; i++) {
      let light = lightsList[i];
      const endpoint = `http://${bridgeip}/api/${username}/lights/${light}/state`;
      const response = await fetch(endpoint, {
        method: "PUT",
        body: `{"on": true, "hue":${lightColours[color]}, "sat":254}`
      });
    }

    reload();
  } catch (err) {
    throw new Error(`Error fetching POSTLightState: ${err}`);
  }
};