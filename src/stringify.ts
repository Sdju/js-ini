import { IIniObject } from './interfaces/ini-object';

export interface IStringifyConfig {
  delimiter?: string;
  blankLine?: boolean;
  spaceBefore?: boolean;
  spaceAfter?: boolean;
  skipUndefined?: boolean;
}

export function stringify(data: IIniObject, params?: IStringifyConfig): string {
  const {
    delimiter = '=',
    blankLine = true,
    spaceBefore = false,
    spaceAfter = false,
    skipUndefined = false,
  } = { ...params };

  const chunks: string[] = [];
  const formatPare = (key: string, val: string): string => {
    let result = key;
    if (spaceBefore) {
      result += ' ';
    }
    result += delimiter;
    if (spaceAfter) {
      result += ' ';
    }
    result += val;
    return result;
  };
  let sectionKeys: string[] | null = null;
  let curKeyId: number = 0;

  for (const key of Object.keys(data)) {
    while (!sectionKeys || (sectionKeys.length !== curKeyId)) {
      let curKey: string;
      if (sectionKeys) {
        curKey = sectionKeys[curKeyId];
        curKeyId += 1;
      } else {
        curKey = key;
      }
      const val: any = (sectionKeys) ? (data[key] as any)[curKey] : data[curKey];
      const valType = typeof val;
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
      } else if (typeof val === 'undefined' && !skipUndefined) {
        chunks.push(formatPare(curKey, ''));
      }
    }
    sectionKeys = null;
    curKeyId = 0;
  }
  return chunks.join('\n');
}

export const encode = stringify;
