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

| name                 | type                  | defaut value | description                                                                     |
|----------------------|-----------------------|--------------|---------------------------------------------------------------------------------|
| **comment**          | `string or string[]`  | `;`          | String for start of comment                                                     |
| **delimiter**        | `string`              | `=`          | Delimiter between key and value                                                 |
| **nothrow**          | `boolean`             | `false`      | Use field `Symbol('Errors of parsing')` instead `throw`                         |
| **autoTyping**       | `boolean or function` | `true`       | Try to auto translate strings to another values (translation map below)         |
| **keyMergeStrategy** | `string or function`  | `true`       | Strategy that will be used for equal keys                                       |
| **dataSections**     | `string[]`            | `[]`         | Section will be marked as dataSection and will be parsed like a array of string |
| **protoSymbol**      | `boolean`             | `false`      | no throw on `__proto__` section and use symbol `Symbol(__proto__)` instead      |

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

| name              | type      | default value | description                           |
|-------------------|-----------|---------------|---------------------------------------|
| **delimiter**     | `string`  | `=`           | Delimiter between key and value       |
| **blankLine**     | `boolean` | `true`        | Add blank lines between sections      |
| **spaceBefore**   | `boolean` | `true`        | Add space between key and delimiter   |
| **spaceAfter**    | `boolean` | `false`       | Add space between value and delimiter |
| **skipUndefined** | `boolean` | `false`       | Don't print keys with undefined value |

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

## Ini-like files
With this library you can parse/generate for different ini-like strings. e.g. with `:` as separator and `#` as comment. Example of unusual syntax
```typescript
const iniLike = `[data]
password:qwnfjfwqknjslfmbn
name:John Doe
# usual comment
`;
console.log(parse(ini, {
  comment: '#',
  delimiter: ':'
}));
/*
    {
      data: {
        password: 'qwnfjfwqknjslfmbn',
        name: 'John Doe'
      }
    }
*/
```

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

## custom autoType
You can provide your own "auto typer". It's possible to change your parsing logic depends on current section and key
```typescript
interface ICustomTyping {
  (val: string, section: string | symbol, key: string): any
}
```
| argument | value              |
|----------|--------------------|
| val      | string for parsing |
| section  | section object     |
| key      | section key        |

Example:
```typescript
const ini = `
license=MIT
[config]
version=24
date=12.04.2017`;

const customParser = (val: string, section: string, key: string) => {
    if (section !== 'config') {
        return val
    }
    if (key === 'date') {
        return new Date(key)
    }
    return Number(val)
};
console.log(parse(ini, { autoTyping: customParser }));
/*
    {
      license: "MIT",
      config: {
        version: 24
        date: Mon Dec 04 2017...
      }
    }
*/
```

## Key Merge Strategies
There are 3 ways of resolving equal keys conflict:

| strategy name                    | const or type            | description                                        |
|----------------------------------|--------------------------|----------------------------------------------------|
| KeyMergeStrategies.OVERRIDE      | 'override'               | result value will be equal to the last value       |
| KeyMergeStrategies.JOIN_TO_ARRAY | 'join-to-array'          | result will be equal to array with all values      |
| custom function                  | KeyMergeStrategyFunction | your own conflict resolver (example will be below) |

```typescript
const ini = `[test]
value = 1
value = 2
value = 3
second = 1
second = 2
another = 1`;

console.log(parse(ini, { keyMergeStrategy: KeyMergeStrategies.OVERRIDE }));
/*
    {
      test: {
        value: 3,
        second: 2,
        another: 1
      }
    }
*/

console.log(parse(ini, { keyMergeStrategy: KeyMergeStrategies.JOIN_TO_ARRAY }));
/*
    {
      test: {
        value: [1, 2, 3],
        second: [1, 2],
        another: 1
      }
    }
*/

// section - section object for merging
// name - section key name
// val - value for merging
const customMergeStrategy = (section: IIniObjectSection, name: string, val: any) => {
  section[name] = name in section ? `${section[name]}|${val.toString()}` : val.toString();
};
console.log(parse(ini, { keyMergeStrategy: customMergeStrategy }));
/*
    {
      test: {
        value: '1|2|3',
        second: '1|2',
        another: '1'
      }
    }
*/
```



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
