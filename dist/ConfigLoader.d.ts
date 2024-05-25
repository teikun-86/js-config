declare class ConfigLoader {
    private configDir;
    private cache;
    constructor(configDir: string);
    private loadConfig;
    get<T>(key: string, defaultValue?: any): T;
    setConfigDir(configDir: string): void;
}
export declare const initializeConfigLoader: (configDir: string) => void;
export declare const getConfigLoader: () => ConfigLoader;
export {};
