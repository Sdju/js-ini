# js-ini
[![Build Status](https://travis-ci.org/Sdju/js-ini.svg?branch=master)](https://travis-ci.org/Sdju/js-ini)

A Node.js package for encoding/decoding ini-like strings.
## Installation 
```sh
npm install js-ini --save
yarn add js-ini
bower install js-ini --save
```
## Examples

Example of parsing:

**configs.ini**
```ini
option = 2
useDatabase= true
password type = string

[Database settings]
nodes=5
user = admin 
; some comment
password = some very*difficult=password:
database-name =my-project-db

[User settings]
param*1  = 2.5
param*2= struct
```
### Javascript version
```javascript
const ini = require('js-ini');
const fs = require('async-file');
fs.readTextFile('configs.ini').then((txt) => {
  console.log(ini.parse(txt));
});
```
### TypeScript version
```typescript
import { parse } from 'js-ini';
import { readTextFile } from 'async-file';
readTextFile('configs.ini').then((txt: string) => {
  console.log(parse(txt));
});
```
**Output:**
```JSON
{
  "option": 2,
  "useDatabase": true,
  "password type": "string",
  "Database settings": {
    "node": 5,
    "user": "admin",
    "password": "some very*difficult=password:"
  },
  "User settings": {
    "param*1": 2.5,
    "param*2": "struct"
  }
}
```


## API
### parse(data: string, params?: IParseConfig): object
**Alias:** `decode`
#### data
Type: `string`

String with ini-like data
#### params
Type: `IParseConfig`

Decoding params

|      name        | type       | defaut value |            description                                                          |
|------------------|------------|--------------|---------------------------------------------------------------------------------|
| **comment**      | `string`   | `;`          | String for start of comment                                                     |
| **delimiter**    | `string`   | `=`          | Delimiter between key and value                                                 |
| **nothrow**      | `boolean`  | `false`      | Use field `Symbol('Errors of parsing')` instead `throw`                         |
| **autoTyping**   | `boolean`  | `true`       | Try to auto translate strings to boolean / number values                        |
| **dataSections** | `string[]` | `[]`         | Section will be marked as dataSection and will be parsed like a array of string |
 
Data section sample:
```ini
option = 2
useDatabase= true
password type = string

[some strings]
a82cfac96d9b71248bf5faa2b22d7cf7
0c420a02dc13656d15aefe71e5b06ecf

[User settings]
param*1  = 2.5
param*2= struct
```
```js
import { parse } from 'js-ini';
import { readTextFile } from 'async-file';
readTextFile('configs.ini').then((txt: string) => {
  console.log(parse(txt, { dataSections: ['some strings'] }));
});
```
Output:
```json
{
  "option": 2,
  "useDatabase": true,
  "password type": "string",
  "some strings": [
  	"a82cfac96d9b71248bf5faa2b22d7cf7",
  	"0c420a02dc13656d15aefe71e5b06ecf"
  ],
  "User settings": {
    "param*1": 2.5,
    "param*2": "struct"
  }
}
```


### stringify(data: object, params?: IStringifyConfig): string
**Alias:** `encode`
#### data
Type: `object`

object to encode to ini-string
#### params
Type: `IStringifyConfig`

Encoding params

|      name       | type      | defaut value |            description                |
|-----------------|-----------|--------------|---------------------------------------|
| **delimiter**   | `string`  | `=`          | Delimiter between key and value       |
| **blankLine**   | `boolean` | `true`       | Add blank lines between sections      |
| **spaceBefore** | `boolean` | `true`       | Add space between key and delimiter   |
| **spaceAfter**  | `boolean` | `false`      | Add space between value and delimiter |

## Test
```sh
npm run test
```

## License
[MIIT](https://github.com/Sdju/js-ini/blob/master/LICENSE)
