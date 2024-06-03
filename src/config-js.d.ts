declare module "@teikun-86/config-js" {
	export interface ConfigLoader {
		setConfigDir(directory: string): void;
		get<T>(key: string, defaultValue?: T): T;
	}

	export interface Config {
		<T = any>(key: string, defaultValue?: any): T;
		initializeConfigLoader: (directory: string) => void;
		getConfigLoader: () => ConfigLoader;
		cache: () => Promise<void>;
	}

	export const config: Config;
}
