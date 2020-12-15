import { $Errors, ParsingError } from './errors';
export * from './errors';

export interface IParseConfig {
  comment?: string;
  delimiter?: string;
  nothrow?: boolean;
  autoTyping?: boolean;
  dataSections?: string[];
}

export interface IStringifyConfig {
  delimiter?: string;
  blankLine?: boolean;
  spaceBefore?: boolean;
  spaceAfter?: boolean;
}

const sectionNameRegex = /\[(.*)]$/;

export type IniValue = string | number | boolean | IIniObjectSection | IIniObjectDataSection;

export interface IIniObjectSection {
  [index: string]: IniValue;
}

export type IIniObjectDataSection = string[];

export interface IIniObject extends IIniObjectSection {
  [$Errors]?: any;
}

const autoType = (val: string): boolean | number | string => {
  if ((val === 'true') || (val === 'false')) {
    return val === 'true';
  }
  if (val === '') {
    return true;
  }
  if (!isNaN(parseFloat(val))) {
    return parseFloat(val);
  }
  return val;
};

export function parse(data: string, params?: IParseConfig): IIniObject {
  const {
    delimiter = '=',
    comment = ';',
    nothrow = false,
    autoTyping = true,
    dataSections = [],
  } = { ...params };

  const lines: string[] = data.split(/\r?\n/g);
  let lineNumber = 0;
  let currentSection: string = '';
  let isDataSection: boolean = false;
  const result: IIniObject = {};

  for (const rawLine of lines) {
    lineNumber += 1;
    const line: string = rawLine.trim();
    if ((line.length === 0) || (line.startsWith(comment))) {
      continue;
    } else if (line[0] === '[') {
      const match = line.match(sectionNameRegex);
      if (match !== null) {
        currentSection = match[1].trim();
        isDataSection = dataSections.includes(currentSection);
        if (!(currentSection in result)) {
          result[currentSection] = (isDataSection) ? [] : {};
        }
        if (currentSection == '__proto__' || currentSection == 'constructor' || currentSection == 'prototype')
          break;
        continue;
      }
    } else if (isDataSection) {
      (<IniValue[]>result[currentSection]).push(rawLine);
      continue;
    } else if (line.includes(delimiter)) {
      const posOfDelimiter: number = line.indexOf(delimiter);
      const name = line.slice(0, posOfDelimiter).trim();
      const rawVal = line.slice(posOfDelimiter + 1).trim();
      const val = (autoTyping) ? autoType(rawVal) : rawVal;
      if (currentSection !== '') {
        (<IIniObjectSection>result[currentSection])[name] = val;
      } else {
        result[name] = val;
      }
      continue;
    }

    const error = new ParsingError(line, lineNumber);
    if (!nothrow) {
      throw error;
    } else {
      if ($Errors in result) {
        result[$Errors].push(error);
      } else {
        result[$Errors] = [error];
      }
    }
  }

  return result;
}

export function stringify(data: IIniObject, params?: IStringifyConfig): string {
  const {
    delimiter = '=',
    blankLine = true,
    spaceBefore = false,
    spaceAfter = false,
  } = { ...params };
  const chunks: string[] = [];
  const formatPare = (key: string, val: string): string => {
    let res: string = key;
    if (spaceBefore) {
      res += ' ';
    }
    res += delimiter;
    if (spaceAfter) {
      res += ' ';
    }
    res += val;
    return res;
  };
  let sectionKeys: string[] | null = null;
  let curKeyId: number = 0;

  for (const key of Object.keys(data)) {
    while (!sectionKeys || (sectionKeys.length !== curKeyId)) {
      let curKey: string;
      if (sectionKeys) {
        curKey = sectionKeys[ curKeyId ];
        curKeyId += 1;
      } else {
        curKey = key;
      }
      const val = (sectionKeys) ? (<any>data[ key ])[ curKey ] : data[ curKey ];
      const valType: string = typeof val;
      if (['boolean', 'string', 'number'].includes(valType)) {
        chunks.push(formatPare(curKey, val.toString()));
        if (!sectionKeys) {
          break;
        }
      } else if (typeof val === 'object') {
        if (sectionKeys) {
          throw new Error('too much nesting');
        }
        if (blankLine) {
          chunks.push('');
        }
        chunks.push(`[${key}]`);
        if (Array.isArray(val)) {
          // is datasection
          chunks.push(...val);
          break;
        } else {
          sectionKeys = Object.keys(val);
        }
      }
    }
    sectionKeys = null;
    curKeyId = 0;
  }
  return chunks.join('\n');
}

export const decode = parse;
export const encode = stringify;
