import * as path from "path";
import {
	initializeConfigLoader,
	getConfigLoader
} from "../src/ConfigLoader";

import { config } from "../src"

// Helper function to reset module cache between tests
const resetModule = () => {
	jest.resetModules();
	process.env = {};
};

beforeEach(() => {
	resetModule();
	initializeConfigLoader(path.resolve(__dirname, "./config"));
});

describe("ConfigLoader", () => {
	it("should load configuration values correctly", () => {
		expect(config("app.name")).toBe("My App");
		expect(config("app.env")).toBe("development");
		expect(config("app.version")).toBe("1.0.0");
		expect(config("database.host")).toBe("localhost");
		expect(config("database.port")).toBe(3306);
	});

	it("should return default value for non-existent keys", () => {
		expect(config("app.nonExistentKey", "default")).toBe("default");
		expect(config("database.nonExistentKey", 12345)).toBe(12345);
	});

	it("should throw an error if the configuration directory does not exist", () => {
		expect(() =>
			initializeConfigLoader(
				path.resolve(__dirname, "./non-existent-config")
			)
		).toThrow();
	});

	it("should allow changing the configuration directory", () => {
		const configLoader = getConfigLoader();
		configLoader.setConfigDir(path.resolve(__dirname, "./new-config"));

		expect(config("app.name")).toBe("My App V2");
		expect(config("app.env")).toBe("production");
		expect(config("app.version")).toBe("2.0.0");
		expect(config("database.host")).toBe("newhost");
		expect(config("database.port")).toBe(5432);
	});

	it("should throw an error if changing to a non-existent configuration directory", () => {
		const configLoader = getConfigLoader();
		expect(() =>
			configLoader.setConfigDir(
				path.resolve(__dirname, "./non-existent-config")
			)
		).toThrow();
	});
});
