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
### Javascript
```javascript
const ini = require('js-ini');
const fs = require('async-file');
fs.readTextFile('configs.ini').then((txt) => {
  console.log(ini.parse(obj));
});
```
### TypeScript
```typescript
import { parse } = require('js-ini');
import { readTextFile } = require('async-file');
readTextFile('configs.ini').then((txt: string) => {
  console.log(parse(obj));
});
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
