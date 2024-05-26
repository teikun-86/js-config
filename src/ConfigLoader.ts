import * as fs from "fs";
import * as path from "path";

export interface ConfigLoader {
	setConfigDir(directory: string): void;
	get<T>(key: string, defaultValue?: T): T;
}

export interface Config {
	<T = any>(key: string, defaultValue?: any): T;
	initializeConfigLoader: (directory: string) => void;
	getConfigLoader: () => ConfigLoader;
}

let configDir: string | null = null;
let cache: Record<string, any> = {};

const initializeConfigLoader = (directory: string): void => {
	if (!fs.existsSync(directory)) {
		throw new Error(`Configuration directory ${directory} does not exist.`);
	}
	configDir = directory;
	cache = {};
};

const loadConfigFile = (filePath: string): any => {
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

const getConfigLoader = (): ConfigLoader => {
	if (!configDir) {
		throw new Error(
			"ConfigLoader has not been initialized with a configuration directory."
		);
	}

	return {
		setConfigDir: (directory: string): void => {
			if (!fs.existsSync(directory)) {
				throw new Error(
					`Configuration directory ${directory} does not exist.`
				);
			}
			configDir = directory;
			cache = {};
		},

		get: <T>(key: string, defaultValue?: T): T => {
			if (!configDir) {
				throw new Error(
					"ConfigLoader has not been initialized with a configuration directory."
				);
			}

			const keys = key.split(".");
			const configFileName = keys.shift()!;
			const configFilePath = path.join(configDir, `${configFileName}.js`);

			if (!(configFilePath in cache)) {
				cache[configFilePath] = loadConfigFile(configFilePath);
			}

			let result = cache[configFilePath];

			for (const k of keys) {
				result = result[k];
				if (result === undefined) {
					return defaultValue as T;
				}
			}

			return result as T;
		}
	};
};

const config: Config = <T = any>(key: string, defaultValue: any = null): T => {
	const loader = getConfigLoader();
	return loader.get<T>(key, defaultValue);
};

config.initializeConfigLoader = initializeConfigLoader;
config.getConfigLoader = getConfigLoader;

export { config };