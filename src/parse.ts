import {
  $Errors,
  ParsingError,
  ProtoError,
} from './errors';
import { IIniObject } from './interfaces/ini-object';
import { IniValue } from './types/ini-value';
import { IIniObjectSection } from './interfaces/ini-object-section';
import { autoType } from './helpers/auto-type';
import { ICustomTyping } from './interfaces/custom-typing';
import { $Proto } from './proto';

export const KeyMergeStrategies = {
  OVERRIDE: 'override',
  JOIN_TO_ARRAY: 'join-to-array',
} as const;
export type KeyMergeStrategyName = typeof KeyMergeStrategies[keyof typeof KeyMergeStrategies];

export type KeyMergeStrategyFunction =
  (section: IIniObjectSection, name: string, value: any) => void;

export interface IParseConfig {
  comment?: string | string[];
  delimiter?: string;
  nothrow?: boolean;
  autoTyping?: boolean | ICustomTyping;
  keyMergeStrategy?: KeyMergeStrategyName | KeyMergeStrategyFunction;
  dataSections?: string[];
  protoSymbol?: boolean;
}

const sectionNameRegex = /\[(.*)]$/;

export function parse(data: string, params?: IParseConfig): IIniObject {
  const {
    delimiter = '=',
    comment = ';',
    nothrow = false,
    autoTyping = true,
    dataSections = [],
    protoSymbol = false,
    keyMergeStrategy = KeyMergeStrategies.OVERRIDE,
  } = { ...params };
  let typeParser: ICustomTyping;
  if (typeof autoTyping === 'function') {
    typeParser = autoTyping;
  } else {
    typeParser = autoTyping ? autoType : (val) => val;
  }

  const isOverrideStrategy = keyMergeStrategy === KeyMergeStrategies.OVERRIDE;
  const isJoinStrategy = !isOverrideStrategy
    && (keyMergeStrategy === KeyMergeStrategies.JOIN_TO_ARRAY);
  const isCustomStrategy = !isOverrideStrategy
    && !isJoinStrategy
    && typeof keyMergeStrategy === 'function';

  const lines: string[] = data.split(/\r?\n/g);
  let lineNumber = 0;
  let currentSection = '';
  let isDataSection = false;
  const result: IIniObject = {};
  const commentChars = Array.isArray(comment) ? comment : [comment];

  for (const rawLine of lines) {
    lineNumber += 1;
    const line: string = rawLine.trim();
    if ((line.length === 0) || commentChars.some((char) => line.startsWith(char))) {
      continue;
    } else if (line[0] === '[') {
      const match = line.match(sectionNameRegex);
      if (match) {
        currentSection = match[1].trim();
        if (currentSection === '__proto__') {
          if (protoSymbol) {
            currentSection = $Proto as unknown as string;
          } else {
            throw new ProtoError(lineNumber);
          }
        }
        isDataSection = dataSections.includes(currentSection);
        if (!(currentSection in result)) {
          result[currentSection] = (isDataSection) ? [] : Object.create(null);
        }
        continue;
      }
    } else if (isDataSection) {
      (result[currentSection] as IniValue[]).push(rawLine);
      continue;
    } else if (line.includes(delimiter)) {
      const posOfDelimiter = line.indexOf(delimiter);
      const name = line.slice(0, posOfDelimiter).trim();
      const rawVal = line.slice(posOfDelimiter + 1).trim();
      const val = typeParser(rawVal, currentSection, name);
      const section = (currentSection !== '') ? (result[currentSection] as IIniObjectSection) : result;
      if (isOverrideStrategy) {
        section[name] = val;
      } else if (isJoinStrategy) {
        if (name in section) {
          const oldVal = section[name];
          if (Array.isArray(oldVal)) {
            oldVal.push(val);
          } else {
            section[name] = [oldVal, val];
          }
        } else {
          section[name] = val;
        }
      } else if (isCustomStrategy) {
        keyMergeStrategy(section, name, val);
      }
      continue;
    }

    const error = new ParsingError(line, lineNumber);
    if (!nothrow) {
      throw error;
    } else if ($Errors in result) {
      (result[$Errors] as ParsingError[]).push(error);
    } else {
      result[$Errors] = [error];
    }
  }

  return result;
}

export const decode = parse;
