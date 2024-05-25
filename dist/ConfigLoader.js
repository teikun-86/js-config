"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigLoader = exports.initializeConfigLoader = void 0;
const fs = require("fs");
const path = require("path");
class ConfigLoader {
    constructor(configDir) {
        this.cache = {};
        this.configDir = configDir;
        if (!fs.existsSync(this.configDir)) {
            throw new Error(`Configuration directory does not exist: ${this.configDir}`);
        }
    }
    loadConfig(file) {
        if (this.cache[file]) {
            return this.cache[file];
        }
        const filePath = path.join(this.configDir, `${file}.json`);
        if (fs.existsSync(filePath)) {
            const configFile = fs.readFileSync(filePath, "utf-8");
            const config = JSON.parse(configFile);
            this.cache[file] = config;
            return config;
        }
        else {
            throw new Error(`Configuration file not found: ${filePath}`);
        }
    }
    get(key, defaultValue = null) {
        const [file, ...pathSegments] = key.split(".");
        const config = this.loadConfig(file);
        let value = config;
        for (const segment of pathSegments) {
            if (value[segment] !== undefined) {
                value = value[segment];
            }
            else {
                return defaultValue;
            }
        }
        return value;
    }
    setConfigDir(configDir) {
        if (!fs.existsSync(configDir)) {
            throw new Error(`Configuration directory does not exist: ${configDir}`);
        }
        this.configDir = configDir;
        this.cache = {}; // Clear the cache when changing the directory
    }
}
// Create a singleton instance of ConfigLoader
let configLoader;
const initializeConfigLoader = (configDir) => {
    configLoader = new ConfigLoader(configDir);
};
exports.initializeConfigLoader = initializeConfigLoader;
const getConfigLoader = () => {
    if (!configLoader) {
        throw new Error("ConfigLoader has not been initialized. Call initializeConfigLoader first.");
    }
    return configLoader;
};
exports.getConfigLoader = getConfigLoader;
