const { Menu } = require("electron");
const bridgeIP = require("../calls/GET/bridge_ip");
module.exports = (store, tray) => {
  try {
    console.log("in login");

    const loginMenu = Menu.buildFromTemplate([
      {
        label: "Find Bridge",
        click() {
          bridgeIP(store, tray);
        }
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        role: "quit"
      }
    ]);
    tray.setContextMenu(loginMenu);
  } catch (err) {
    throw new Error(`Error in locateBridge: ${err}`);
  }
};
