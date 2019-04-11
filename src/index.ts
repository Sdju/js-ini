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

export const $Errors: unique symbol = Symbol('Errors of parsing');
const createErrorOfParse = (line: string) => new Error(`Unsupported type of line: "${line}"`);
const sectionNameRegex = /\[(.*)]$/;

export type IniValue = string | number | boolean;

export interface IIniObjectSection {
  [index: string]: IniValue;
}

export interface IIniObjectDataSection {
  [index: number]: IniValue;
}

export interface IIniObject {
  [index: string]: IIniObjectSection | IIniObjectDataSection | IniValue;

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
  let currentSection: string = '';
  let isDataSection: boolean = false;
  const result: IIniObject = {};

  for (const rawLine of lines) {
    const line: string = rawLine.trim();
    if ((line.length === 0) || (line.startsWith(comment))) {
      continue;
    } else if (line[0].startsWith('[')) {
      const match = line.match(sectionNameRegex);
      if (match !== null) {
        currentSection = match[1].trim();
        isDataSection = dataSections.includes(currentSection);
        if (!(currentSection in result)) {
          result[currentSection] = (isDataSection) ? [] : {};
        }
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

    const error = createErrorOfParse(line);
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
  const sectionKeys: string[] = [];

  for (const key of Object.keys(data)) {
    let keyIsAdded: boolean = false;
    while ((sectionKeys.length > 0) || !keyIsAdded) {
      const curKey: string = (keyIsAdded) ? <string>sectionKeys.pop() : key;
      const val = (keyIsAdded) ? (<any>data[key])[curKey] : data[curKey];
      keyIsAdded = true;
      const valType: string = typeof val;
      if (['boolean', 'string', 'number'].includes(valType)) {
        chunks.push(formatPare(curKey, val.toString()));
      } else if (typeof val === 'object') {
        if (sectionKeys.length > 0) {
          throw new Error('too much nesting');
        }
        if (blankLine) {
          chunks.push('');
        }
        chunks.push(`[${key}]`);
        sectionKeys.push(...Object.keys(val));
      }
    }
  }
  return chunks.join('\n');
}

export const decode = parse;
export const encode = stringify;
