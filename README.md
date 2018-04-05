# js-ini
[![Build Status](https://travis-ci.org/Sdju/js-ini.svg?branch=master)](https://travis-ci.org/Sdju/js-ini)

A Node.js module that returns the parse and stringify ini-like strings.
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
```
Output:
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
## API
### parse(data: string, params?: IParseConfig): object
#### data
Type: `string`
string with ini data
#### params
Type: `IParseConfig`
##### comment
Type: `string`
Default: `;`
String for start of comment
##### delimiter
Type: `string`
Default: `=`
Delimiter between key and value
##### nothrow
Type: `boolean`
Default: `false`
##### autoTyping
Type: `boolean`
Default: `true`
Tries to translate strings to boolean / number

### stringify(data: object, params?: IStringifyConfig): string
#### data
Type: `object`
object to convert in ini-string
#### params
Type: IStringifyConfig
conversion parameters in ini-string
##### delimiter
Type: `string`
Default: `=`
Delimiter between key and value
##### blackLine
Type: `boolean`
Default: `true`
Add blank lines between sections
##### spaceBefore
Type: `boolean`
Default: `false`
Add space between key and delimiter
##### spaceAfter
Type: `boolean`
Default: `false`
Add space between value and delimiter
## Test
```sh
npm run test
```
