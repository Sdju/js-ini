import { $Errors, ParsingError } from './errors';
import { IIniObject } from './interfaces/ini-object';
import { IniValue } from './types/ini-value';
import { IIniObjectSection } from './interfaces/ini-object-section';

export interface IParseConfig {
  comment?: string;
  delimiter?: string;
  nothrow?: boolean;
  autoTyping?: boolean;
  dataSections?: string[];
}

const sectionNameRegex = /\[(.*)]$/;

const autoType = (val: string): boolean | number | string => {
  if ((val === 'true') || (val === 'false')) {
    return val === 'true';
  }
  if (val === '') {
    return true;
  }
  if (!Number.isNaN(parseFloat(val))) {
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
    } else if ($Errors in result) {
      (<ParsingError[]>result[$Errors]).push(error);
    } else {
      result[$Errors] = [error];
    }
  }

  return result;
}

export const decode = parse;