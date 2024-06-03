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
declare const config: Config;
export { config };
