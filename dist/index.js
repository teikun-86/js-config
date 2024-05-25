"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path = require("path");
const ConfigLoader_1 = require("./ConfigLoader");
// Initialize the ConfigLoader with the initial configuration directory
(0, ConfigLoader_1.initializeConfigLoader)(path.resolve(process.cwd(), "../config"));
const configLoader = (0, ConfigLoader_1.getConfigLoader)();
const appName = configLoader.get("app.name");
const appEnv = configLoader.get("app.env");
const dbHost = configLoader.get("database.host");
const dbPort = configLoader.get("database.port");
console.log(`App Name: ${appName}`);
console.log(`App Environment: ${appEnv}`);
console.log(`Database Host: ${dbHost}`);
console.log(`Database Port: ${dbPort}`);
// Dynamically change the configuration directory if needed
try {
    configLoader.setConfigDir(path.resolve(process.cwd(), "../new-config"));
    const newAppName = configLoader.get("app.name");
    console.log(`New App Name: ${newAppName}`);
}
catch (error) {
    console.error(error.message);
}
const config = (key, defaultValue = null) => {
    const loader = (0, ConfigLoader_1.getConfigLoader)();
    return loader.get(key, defaultValue);
};
exports.config = config;
