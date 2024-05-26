import * as path from "path";

import { config } from "../src";

const resetModule = () => {
	jest.resetModules();
	process.env = {};
};

beforeEach(() => {
	resetModule();
	config.initializeConfigLoader(path.resolve(__dirname, "./config"));
});

describe("ConfigLoader", () => {
	it("should load configuration values correctly from JS files", () => {
		expect(config("app.name")).toBe("MyApp");
		expect(config("app.env")).toBe("development");
	});

	it("should load configuration values correctly from TS files", () => {
		expect(config("database.host")).toBe("localhost");
		expect(config("database.port")).toBe(3306);
	});

	it("should return default value for non-existent keys", () => {
		expect(config("app.nonExistentKey", "default")).toBe("default");
		expect(config("database.nonExistentKey", 12345)).toBe(12345);
	});

	it("should throw an error if the configuration directory does not exist", () => {
		expect(() =>
			config.initializeConfigLoader(
				path.resolve(__dirname, "./non-existent-config")
			)
		).toThrow();
	});

	it("should allow changing the configuration directory", () => {
		const configLoader = config.getConfigLoader();
		configLoader.setConfigDir(path.resolve(__dirname, "./new-config"));

		expect(config("app.name")).toBe("My App V2");
		expect(config("app.env")).toBe("production");
		expect(config("database.host")).toBe("newhost");
		expect(config("database.port")).toBe(5432);
	});

	it("should throw an error if changing to a non-existent configuration directory", () => {
		const configLoader = config.getConfigLoader();
		expect(() =>
			configLoader.setConfigDir(
				path.resolve(__dirname, "./non-existent-config")
			)
		).toThrow();
	});
});
