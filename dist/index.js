"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const ConfigLoader_1 = require("./ConfigLoader");
const config = (key, defaultValue = null) => {
    const loader = (0, ConfigLoader_1.getConfigLoader)();
    return loader.get(key, defaultValue);
};
exports.config = config;
