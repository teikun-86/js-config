import * as path from "path";
import { initializeConfigLoader, getConfigLoader } from "./ConfigLoader";

// Initialize the ConfigLoader with the initial configuration directory
initializeConfigLoader(path.resolve(process.cwd(), "../config"));

const configLoader = getConfigLoader();

const appName: string = configLoader.get("app.name");
const appEnv: string = configLoader.get("app.env");
const dbHost: string = configLoader.get("database.host");
const dbPort: number = configLoader.get("database.port");

console.log(`App Name: ${appName}`);
console.log(`App Environment: ${appEnv}`);
console.log(`Database Host: ${dbHost}`);
console.log(`Database Port: ${dbPort}`);

// Dynamically change the configuration directory if needed
try {
	configLoader.setConfigDir(path.resolve(process.cwd(), "../new-config"));
	const newAppName: string = configLoader.get("app.name");
	console.log(`New App Name: ${newAppName}`);
} catch (error: any) {
	console.error(error.message);
}

export const config = <T = any>(key: string, defaultValue: any = null): T => {
	const loader = getConfigLoader();
	return loader.get<T>(key, defaultValue);
};