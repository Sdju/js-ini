import { IIniObject } from './interfaces/ini-object';

export interface IStringifyConfig {
  delimiter?: string;
  blankLine?: boolean;
  spaceBefore?: boolean;
  spaceAfter?: boolean;
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
    let result: string = key;
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
      const val: any = (sectionKeys) ? (<any>data[key])[curKey] : data[curKey];
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

export const encode = stringify;
