import { getConfigLoader } from "./ConfigLoader";

export const config = <T = any>(key: string, defaultValue: any = null): T => {
	const loader = getConfigLoader();
	return loader.get<T>(key, defaultValue);
};