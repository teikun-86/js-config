import * as fs from "fs";
import * as path from "path";
import { Config } from "./types";

class ConfigLoader {
	private configDir: string;
	private cache: Config = {};

	constructor(configDir: string) {
		this.configDir = configDir;
		if (!fs.existsSync(this.configDir)) {
			throw new Error(
				`Configuration directory does not exist: ${this.configDir}`
			);
		}
	}

	private loadConfig<T>(file: string): T {
		if (this.cache[file]) {
			return this.cache[file];
		}

		const filePath = path.join(this.configDir, `${file}.json`);
		if (fs.existsSync(filePath)) {
			const configFile = fs.readFileSync(filePath, "utf-8");
			const config = JSON.parse(configFile);
			this.cache[file] = config;
			return config;
		} else {
			throw new Error(`Configuration file not found: ${filePath}`);
		}
	}

	get<T>(key: string, defaultValue: any = null): T {
		const [file, ...pathSegments] = key.split(".");
		const config = this.loadConfig<Config[keyof Config]>(file);

		let value: any = config;
		for (const segment of pathSegments) {
			if (value[segment] !== undefined) {
				value = value[segment];
			} else {
				return defaultValue;
			}
		}
		return value;
	}

	setConfigDir(configDir: string): void {
		if (!fs.existsSync(configDir)) {
			throw new Error(
				`Configuration directory does not exist: ${configDir}`
			);
		}
		this.configDir = configDir;
		this.cache = {}; // Clear the cache when changing the directory
	}
}

// Create a singleton instance of ConfigLoader
let configLoader: ConfigLoader;

export const initializeConfigLoader = (configDir: string): void => {
	configLoader = new ConfigLoader(configDir);
};

export const getConfigLoader = (): ConfigLoader => {
	if (!configLoader) {
		throw new Error(
			"ConfigLoader has not been initialized. Call initializeConfigLoader first."
		);
	}
	return configLoader;
};
