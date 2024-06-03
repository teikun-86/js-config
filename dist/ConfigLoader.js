import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
let configDir = null;
let cache = {};
const initializeConfigLoader = async (directory) => {
    if (!fs.existsSync(directory)) {
        throw new Error(`Configuration directory ${directory} does not exist.`);
    }
    configDir = directory;
    cache = {};
    await cacheConfig();
};
const loadConfigFile = async (filePath) => {
    const splitted = filePath.split(".");
    const extension = splitted[splitted.length - 1];
    console.log({
        filePath,
        ptf: pathToFileURL(filePath).toString()
    });
    if (!fs.existsSync(filePath)) {
        throw new Error(`Configuration file ${filePath} does not exist.`);
    }
    if (extension === "js" || extension === "ts") {
        const { default: config } = await import(pathToFileURL(filePath).toString());
        return config;
    }
    else {
        const content = fs.readFileSync(filePath, {
            encoding: "utf8"
        });
        return JSON.parse(content);
    }
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
            let result = cache;
            if (!Object.keys(result).length) {
                console.log({
                    result,
                    cache,
                    keys
                });
                throw new Error("The config is not yet cached. Please call `await config.cache()` first.");
            }
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
const cacheConfig = async () => {
    cache = {};
    if (!configDir) {
        throw new Error("ConfigLoader has not been initialized with a configuration directory");
    }
    const files = fs.readdirSync(configDir);
    await Promise.all(files.map(async (file) => {
        const splitted = file.split(".");
        const configName = splitted[0];
        cache[configName] = await loadConfigFile(path.resolve(configDir, file));
    }));
    console.log({ cache });
};
config.cache = cacheConfig;
config.initializeConfigLoader = initializeConfigLoader;
config.getConfigLoader = getConfigLoader;
export { config };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlnTG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbmZpZ0xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUN6QixPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBY3BDLElBQUksU0FBUyxHQUFrQixJQUFJLENBQUM7QUFDcEMsSUFBSSxLQUFLLEdBQXdCLEVBQUUsQ0FBQztBQUVwQyxNQUFNLHNCQUFzQixHQUFHLEtBQUssRUFBRSxTQUFpQixFQUFpQixFQUFFO0lBQ3pFLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsU0FBUyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFDRCxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQ3RCLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDWCxNQUFNLFdBQVcsRUFBRSxDQUFDO0FBQ3JCLENBQUMsQ0FBQztBQUVGLE1BQU0sY0FBYyxHQUFHLEtBQUssRUFBRSxRQUFnQixFQUFpQixFQUFFO0lBQ2hFLE1BQU0sUUFBUSxHQUFhLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsTUFBTSxTQUFTLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUNYLFFBQVE7UUFDUixHQUFHLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRTtLQUN2QyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sSUFBSSxLQUFL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