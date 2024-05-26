# @teikun-86/config-js

A flexible configuration loader for Node.js projects, supporting both JavaScript and TypeScript configuration files. This package allows you to easily manage configuration settings in your application with a simple API.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Initial Setup](#initial-setup)
  - [Loading Configuration Values](#loading-configuration-values)
  - [Changing Configuration Directory](#changing-configuration-directory)
  - [Configuration File Formats](#configuration-file-formats)
- [API](#api)
  - [`config(key: string, defaultValue?: any): any`](#configkey-string-defaultvalue-any-any)
  - [`config.initializeConfigLoader(directory: string): void`](#configinitializeconfigloaderdirectory-string-void)
  - [`config.getConfigLoader(): ConfigLoader`](#configgetconfigloader-configloader)
- [ConfigLoader Interface](#configloader-interface)
  - [`setConfigDir(directory: string): void`](#setconfigdirdirectory-string-void)
  - [`get<T>(key: string, defaultValue?: T): T`](#gettkey-string-defaultvalue-t-t)
- [Example](#example)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)


## Installation

To install the package, use npm:

```sh
npm install config-js
```

Or using yarn:

```sh
yarn add config-js
```

## Usage

### Initial Setup

First, you need to initialize the configuration loader with the directory where your configuration files are located. You can do this using the `initializeConfigLoader` method.

```typescript
import { config } from '@teikun-86/config-js';
import * as path from 'path';

// Initialize the configuration loader with the directory path
config.initializeConfigLoader(path.resolve(__dirname, 'config'));
```

### Loading Configuration Values

Once the loader is initialized, you can use the `config` function to retrieve configuration values. The `config` function takes a key (in dot notation) and an optional default value.

```typescript
const appName = config<string>('app.name');
const appEnv = config<string>('app.env');
const dbHost = config<string>('database.host');
const dbPort = config<number>('database.port');

console.log(`App Name: ${appName}`);
console.log(`App Environment: ${appEnv}`);
console.log(`Database Host: ${dbHost}`);
console.log(`Database Port: ${dbPort}`);
```

### Changing Configuration Directory

If you need to change the configuration directory at runtime, you can use the `setConfigDir` method provided by the loader.

```typescript
const loader = config.getConfigLoader();
loader.setConfigDir(path.resolve(__dirname, 'new-config'));

// Now, config values will be loaded from the new directory
const newAppName = config<string>('app.name');
console.log(`New App Name: ${newAppName}`);
```

### Configuration File Formats

Your configuration files can be in either JavaScript or TypeScript or JSON format. The loader will handle both formats seamlessly.

**JavaScript Configuration File (`config/app.js`):**

```javascript
module.exports = {
  name: 'MyApp',
  env: 'development',
};
```

**TypeScript Configuration File (`config/database.ts`):**

```typescript
export default {
  host: 'localhost',
  port: 3306,
};
```

**JSON Configuration File (`config/app.json`):**

```json
{
  "name": "MyApp",
  "env": "development"
}
```

## API

### `config(key: string, defaultValue?: any): any`

Retrieve the configuration value for the specified key. If the key does not exist, the optional `defaultValue` will be returned.

### `config.initializeConfigLoader(directory: string): void`

Initialize the configuration loader with the directory where your configuration files are located.

### `config.getConfigLoader(): ConfigLoader`

Retrieve the singleton instance of the configuration loader. The `ConfigLoader` interface provides methods to get configuration values and set the configuration directory.

## ConfigLoader Interface

### `setConfigDir(directory: string): void`

Set the configuration directory. This will clear any cached configuration values.

### `get<T>(key: string, defaultValue?: T): T`

Retrieve the configuration value for the specified key. If the key does not exist, the optional `defaultValue` will be returned.

## Example

Here is a complete example to illustrate how to use the `config-js` package:

```typescript
import { config } from '@teikun-86/config-js';
import * as path from 'path';

// Initialize the configuration loader
config.initializeConfigLoader(path.resolve(__dirname, 'config'));

// Retrieve configuration values
const appName = config<string>('app.name');
const appEnv = config<string>('app.env');
const dbHost = config<string>('database.host');
const dbPort = config<number>('database.port');

console.log(`App Name: ${appName}`);
console.log(`App Environment: ${appEnv}`);
console.log(`Database Host: ${dbHost}`);
console.log(`Database Port: ${dbPort}`);

// Change the configuration directory
const loader = config.getConfigLoader();
loader.setConfigDir(path.resolve(__dirname, 'new-config'));

// Retrieve configuration values from the new directory
const newAppName = config<string>('app.name');
console.log(`New App Name: ${newAppName}`);
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or suggestions.

## Acknowledgements

This package was inspired by the need for a simple and flexible configuration loader for Node.js applications, with support for both JavaScript and TypeScript configuration files.
