const { app, Tray } = require("electron");
const path = require("path");
const Store = require("electron-store");
const locateBridge = require("./app/utilis/locateBridge");
const imagesDir = path.join(__dirname, "/app/images");
const buildApp = require("./app/buildApp");

const store = new Store();

if (process.platform === "darwin") {
  app.dock.hide();
}

app.on("ready", async () => {
  // store.clear();
  console.log("starting...");

  try {
    const tray = new Tray(`${imagesDir}/light-off-logo.png`);
    if (!store.has("bridgeip")) {
      locateBridge(store, tray);
    } else {
      buildApp(store, tray);
    }
  } catch (err) {
    console.log(`Error starting app: ${err}`);
  }
});
