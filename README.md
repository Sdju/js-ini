# js-ini
[![Build Status](https://travis-ci.org/Sdju/js-ini.svg?branch=master)](https://travis-ci.org/Sdju/js-ini)
[![NPM version](https://img.shields.io/npm/v/js-ini.svg?style=flat-square)](https://www.npmjs.com/package/js-ini)
[![Downloads](http://img.shields.io/npm/dm/js-ini.svg?style=flat-square)](https://npmjs.org/package/js-ini)

A Node.js package for encoding/decoding ini-like strings.
## Installation
```sh
npm install js-ini --save
yarn add js-ini
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
const fs = require('fs').promises;
fs.readFile('configs.ini', 'utf-8').then((txt) => {
  console.log(ini.parse(txt));
});
```
### TypeScript version
```typescript
import { parse } from 'js-ini';
import { promises as fs } from 'fs';
fs.readFile('configs.ini', 'utf-8').then((txt: string) => {
  console.log(parse(txt));
});
```
**Output:**
```javascript
{
  'option': 2,
  'useDatabase': true,
  'password type': 'string',
  'Database settings': {
    'node': 5,
    'user': 'admin',
    'password': 'some very*difficult=password:'
  },
  'User settings': {
    'param*1': 2.5,
    'param*2': 'struct'
  }
}
```


## API
### parse(data: string, params?: IParseConfig): IIniObject
**Alias:** `decode`
#### data
Type: `string`

String with ini-like data
#### params
Type: `IParseConfig`

Decoding params

|      name        | type       | defaut value   |            description                                                          |
|------------------|------------|----------------|---------------------------------------------------------------------------------|
| **comment**      | `string \| string[]`      | `;` | String for start of comment                                                 |
| **delimiter**    | `string`   | `=`            | Delimiter between key and value                                                 |
| **nothrow**      | `boolean`  | `false`        | Use field `Symbol('Errors of parsing')` instead `throw`                         |
| **autoTyping**   | `boolean`  | `true`         | Try to auto translate strings to another values (translation map below)         |
| **dataSections** | `string[]` | `[]`           | Section will be marked as dataSection and will be parsed like a array of string |
| **protoSymbol**  | `boolean`  | `false`        | no throw on `__proto__` section and use symbol `Symbol(__proto__)` instead      |

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
```typescript
import { parse } from 'js-ini';
import { promises as fs } from 'fs';
fs.readFile('configs.ini', 'utf-8').then((txt: string) => {
  console.log(parse(txt, { dataSections: ['some strings'] }));
});
```
Output:
```javascript
{
  'option': 2,
  'useDatabase': true,
  'password type': "string",
  'some strings':
    'a82cfac96d9b71248bf5faa2b22d7cf7',
    '0c420a02dc13656d15aefe71e5b06ecf'
  ],
  'User settings': {
    'param*1': 2.5,
    'param*2': 'struct'
  }
}
```


### stringify(data: IIniObject, params?: IStringifyConfig): string
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

### $Errors
It is `Symbol('Errors of parsing')` for `nothrow` option

#### Example:
**configs.ini**
```ini
[scope with trash]
ok = value
trash
[scope with only trash]
only trash
[normal scope]
ok = value
```

```javascript
const ini = require('js-ini');
const fs = require('fs').promises;
fs.readFile('configs.ini', 'utf-8').then((txt) => {
  console.log(ini.parse(txt));
});
```
**Output:**
```javascript
{
  'scope with trash': {
    'ok': 'value',
  },
  'empty scope': {},
  'normal scope': {
    ok: 'value',
  },
  Symbol('Errors of parsing'): [
    new ParsingError('trash', 3),
    new ParsingError('only trash', 7),
  ]
}
```

### $Proto
It is `Symbol(__proto__)` for `protoSymbol` option

## Translation map for autoType
| value           | to              |
|-----------------|-----------------|
| `true`/`false`  | `true`/`false`  |
| `0`/`5.5`/`nan` | `0`/`5.5`/`NaN` |
| blank value     | `undefined`     |
| `null`          | `null`          |
| `12.4abc`       | `'12.4abc'`     |
| `0xFF66AA`      | `16737962`      |
* Translating is case-insensitive
* Other values will be translated to padded strings

## Additional tools
The library is provided with simple helpers that should help decrease size of boilerplate.
Tools are divided into separated files which are not included to the default export.

### readIniFile(path: string, params?: IParseConfig): Promise\<IIniObject\>
`readIniFile` reads `path` file and parses it
#### Usage
```typescript
import { readIniFile } from 'js-ini/tools/read-ini'

await readIniFile('./mydir/example.ini', { nothrow: true })
```


### writeIniFile(path: string, params?: IParseConfig): Promise\<IIniObject\>
`writeIniFile` translate `ini` object to ini-like string
#### Usage
```typescript
import { writeIniFile } from 'js-ini/tools/write-ini'

await writeIniFile('./mydir/example.ini', {
  server: {
    IP: '127.0.0.1',
    user: 'Smith'
  }
}, { nothrow: true })
```


## Test
```sh
npm run test
```

## License
[MIT](https://github.com/Sdju/js-ini/blob/master/LICENSE)
