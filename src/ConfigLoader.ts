import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

export interface ConfigLoader {
	setConfigDir(directory: string): void;
	get<T>(key: string, defaultValue?: T): T;
}

export interface Config {
	<T = any>(key: string, defaultValue?: any): T;
	initializeConfigLoader: (directory: string) => Promise<void>;
	getConfigLoader: () => ConfigLoader;
	cache: () => Promise<void>;
}

let configDir: string | null = null;
let cache: Record<string, any> = {};

const initializeConfigLoader = async (directory: string): Promise<void> => {
	if (!fs.existsSync(directory)) {
		throw new Error(`Configuration directory ${directory} does not exist.`);
	}
	configDir = directory;
	cache = {};
	await cacheConfig();
};

const loadConfigFile = async (filePath: string): Promise<void> => {
	const splitted: string[] = filePath.split(".");
	const extension: string = splitted[splitted.length - 1];

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
	} else {
		const content = fs.readFileSync(filePath, {
			encoding: "utf8"
		});
		return JSON.parse(content);
	}
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
			let result = cache;

			if (!Object.keys(result).length) {
				console.log({
					result,
					cache,
					keys
				});

				throw new Error(
					"The config is not yet cached. Please call `await config.cache()` first."
				);
			}

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

const cacheConfig = async () => {
	cache = {};
	if (!configDir) {
		throw new Error(
			"ConfigLoader has not been initialized with a configuration directory"
		);
	}

	const files = fs.readdirSync(configDir);
	await Promise.all(
		files.map(async (file) => {
			const splitted = file.split(".");
			const configName = splitted[0];
			cache[configName] = await loadConfigFile(
				path.resolve(configDir as string, file)
			);
		})
	);
	console.log({ cache });
};

config.cache = cacheConfig;
config.initializeConfigLoader = initializeConfigLoader;
config.getConfigLoader = getConfigLoader;

export { config };
