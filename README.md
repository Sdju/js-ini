# js-ini
A Node.js module that returns the parse and stringify ini-like strings
js-ini can use in browsers
## Installation 
```sh
npm install js-ini --save
yarn add js-ini
bower install js-ini --save
```
## Usage
### configs.ini
```ini
key1 = 2
key-2=true
key 3 = string
[smbd]
key1=5
key2 = what 
; some comment
key3 = who is who = who

[test scope with spaces]
key*1  = 2.5
```
### Javascript
```javascript
const ini = require('js-ini');
const fs = require('async-file');
fs.readTextFile('configs.ini').then((txt) => {
  console.log(ini.parse(txt));
});
```
### TypeScript
```typescript
import { parse } from 'js-ini';
import { readTextFile } from 'async-file';
readTextFile('configs.ini').then((txt: string) => {
  console.log(parse(txt));
});
```javascript
{
  key1: 2,
  'key-2': true,
  'key 3': 'string',
  smbd: {
    key1: 5,
    key2: 'what',
    key5: 'who is who = who',
  },
  'test scope with spaces': {
    'key*1': 2.5,
  },
}
```
### AMD
```javascript
define(function(require,exports,module){
  var ini = require('js-ini');
});
```
## Test 
```sh
npm run test
```
