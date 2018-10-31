const path = require("path");
const AsyncPolling = require("async-polling");

const { app, Menu, Tray } = require("electron");
const location = require("./location");
const weather = require("./weather");
const ICONS = require("./icon");
const isEnvSet = "ELECTRON_IS_DEV" in process.env;
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !app.isPackaged;

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "..", "node_modules", ".bin", "electron"),
    hardResetMethod: "exit"
  });
}

const iconPath = path.join(__dirname, "assets", "conditions");

let tray;
const createTray = async () => {
  tray = new Tray(`${iconPath}/fogTemplate.png`);
  const cityState = await location.cityState();
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: cityState },
      {
        label: "Quit",
        click: () => {
          app.quit();
        }
      }
    ])
  );
  tray.setToolTip("Weather Bar");
  updateTemperature();
};

async function updateTemperature() {
  if (tray) {
    const latLong = await location.latLong();
    const currentWeather = await weather.get(latLong.lat, latLong.long);
    const temperature = Math.round(
      currentWeather.currently.apparentTemperature
    ).toString();
    tray.setTitle(`${temperature}°`);
    const icon = currentWeather.currently.icon;
    const iconFile = ICONS[icon] ? ICONS[icon] : "fogTemplate";
    tray.setImage(`${iconPath}/${iconFile}.png`);
  }
}

const pollWeather = end => {
  if (tray) updateTemperature();
  end();
};

AsyncPolling(pollWeather, 3600000).run();

app.on("ready", () => createTray());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

if (process.platform === "darwin") app.dock.hide();
