/**
 * @format
 */
import { YellowBox, AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings([
  'Remote debugger',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

AppRegistry.registerComponent(appName, () => App);
