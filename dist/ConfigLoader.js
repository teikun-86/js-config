import * as fs from "fs";
import * as path from "path";
let configDir = null;
let cache = {};
const initializeConfigLoader = (directory) => {
    if (!fs.existsSync(directory)) {
        throw new Error(`Configuration directory ${directory} does not exist.`);
    }
    configDir = directory;
    cache = {};
};
const loadConfigFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        return require(filePath);
    }
    const tsFilePath = filePath.replace(/\.js$/, ".ts");
    if (fs.existsSync(tsFilePath)) {
        return require(tsFilePath).default;
    }
    const jsonFilePath = tsFilePath.replace(/\.ts$/, ".json");
    if (fs.existsSync(jsonFilePath)) {
        return require(jsonFilePath);
    }
    throw new Error(`Configuration file ${filePath} or ${tsFilePath} or ${jsonFilePath} does not exist.`);
};
const getConfigLoader = () => {
    if (!configDir) {
        throw new Error("ConfigLoader has not been initialized with a configuration directory.");
    }
    return {
        setConfigDir: (directory) => {
            if (!fs.existsSync(directory)) {
                throw new Error(`Configuration directory ${directory} does not exist.`);
            }
            configDir = directory;
            cache = {};
        },
        get: (key, defaultValue) => {
            if (!configDir) {
                throw new Error("ConfigLoader has not been initialized with a configuration directory.");
            }
            const keys = key.split(".");
            const configFileName = keys.shift();
            const configFilePath = path.join(configDir, `${configFileName}.js`);
            if (!(configFilePath in cache)) {
                cache[configFilePath] = loadConfigFile(configFilePath);
            }
            let result = cache[configFilePath];
            for (const k of keys) {
                result = result[k];
                if (result === undefined) {
                    return defaultValue;
                }
            }
            return result;
        }
    };
};
const config = (key, defaultValue = null) => {
    const loader = getConfigLoader();
    return loader.get(key, defaultValue);
};
config.initializeConfigLoader = initializeConfigLoader;
config.getConfigLoader = getConfigLoader;
export { config };
