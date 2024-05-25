# config-js

A simple and flexible configuration loader for Node.js applications, inspired by Laravel's configuration system.

## Features

- Load configuration from JSON files
- Supports nested configuration keys
- Caching of configuration values for better performance
- Dynamically change configuration directory

## Installation

Install the package using npm:

```bash
npm install config-js
```

## Usage
1. Initialize the Config Loader

    You need to initialize the config loader with the path to your configuration directory.
    ```typescript
    import * as path from 'path';
    import { initializeConfigLoader } from 'config-js';

    // Initialize the ConfigLoader with the configuration directory
    initializeConfigLoader(path.resolve(__dirname, '../config'));
    ```
2. Access Configuration Values
    You can access configuration values using the `config` function. The configuration keys are dot-notated strings representing the nested structure of your configuration files.
    ```typescript
    import { config } from 'config-js';

    // Example usage of the config function after initialization
    const appName: string = config('app.name');
    const appEnv: string = config('app.env');
    const dbHost: string = config('database.host');
    const dbPort: number = config('database.port');

    console.log(`App Name: ${appName}`);
    console.log(`App Environment: ${appEnv}`);
    console.log(`Database Host: ${dbHost}`);
    console.log(`Database Port: ${dbPort}`);

    ```
3. Change Configuration Directory
    If you need to change the configuration directory at runtime, you can use the `setConfigDir` method.
    ```typescript
    import { getConfigLoader } from 'config-js';

    const configLoader = getConfigLoader();

    try {
    configLoader.setConfigDir(path.resolve(__dirname, '../new-config'));
    const newAppName: string = config('app.name');
    console.log(`New App Name: ${newAppName}`);
    } catch (error) {
    console.error(error.message);
    }
    ```

## API
### `initializeConfigLoader(configDir: string): void`
Initializes the configuration loader with the given configuration directory. This must be called before accessing any configuration values.

### `config<T>(key: string, defaultValue?: any): T`
Retrieves the configuration value for the given key. Returns `defaultValue` if the key is not found.

### `ConfigLoader`
#### `setConfigDir(configDir: string): void`
Sets a new configuration directory and clears the cache. Throws an error if the directory does not exist.

#### `get<T>(key: string, defaultValue?: any): T`
Retrieves the configuration value for the given key from the current configuration directory. Returns `defaultValue` if the key is not found.

## Configuration Structure
The configuration files are expected to be in JSON format and placed in the specified configuration directory. The configuration keys are derived from the nested structure of these files.

### Example Configuration Files
#### config/app.json:
```json
{
  "name": "MyApp",
  "env": "development"
}
```
#### config/database.json:
```json
{
  "host": "localhost",
  "port": 3306
}
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License
This project is licensed under the MIT License. See the [LICENSE.txt](LICENSE.txt) file for details.


### Final Note

This `README.md` covers the basic usage and setup for your `config-js` package, including installation, initialization, usage, and API documentation. It also provides an example configuration structure and outlines how to change the configuration directory at runtime. Make sure to adjust any paths and examples to fit the actual structure and functionality of your package.
