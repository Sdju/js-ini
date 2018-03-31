export interface IParseConfig {
  comment?: string;
  delimiter?: string;
  nothrow?: boolean;
  autoTyping?: boolean;
}

export interface IStringifyConfig {

}

const $Errors: symbol = Symbol('Errors of parsing');
const createErrorOfParse = (line: string) => new Error(`Unsupported type of line: "${line}"`);
const sectionNameRegex = /\[(.*)]$/;

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

export function parse(data: string, params?: IParseConfig) {
  const { delimiter, comment, nothrow, autoTyping } = {
    delimiter: '=',
    comment: ';',
    nothrow: false,
    autoTyping: true,
    ...params,
  };

  const lines: string[] = data.split(/\r?\n/g);
  let currentSection: string = '';
  const result: any = {};

  for (const rawLine of lines) {
    const line: string = rawLine.trim();
    if ((line.length === 0) || (line.startsWith(comment))) {
      continue;
    } else if (line[0].startsWith('[')) {
      const match = line.match(sectionNameRegex);
      if (match !== null) {
        currentSection = match[1].trim();
        continue;
      }
    } else if (line.includes(delimiter)) {
      const posOfDelimiter: number = line.indexOf(delimiter);
      const name = line.slice(0, posOfDelimiter).trim();
      const rawVal = line.slice(posOfDelimiter + 1).trim();
      const val = (autoTyping) ? autoType(rawVal) : rawVal;
      if (currentSection !== '') {
        if (result[currentSection] !== void 0) {
          result[currentSection][name] = val;
        } else {
          result[currentSection] = { [name]: val };
        }
      } else {
        result[name] = val;
      }
      continue;
    }
    const error = createErrorOfParse(line);
    if (!nothrow) {
      throw error;
    } else {
      if (result[$Errors] !== void 0) {
        result[$Errors] = [error];
      } else {
        result[$Errors].push(error);
      }
    }
  }
  return result;
}

export function stringify(data: any, params?: IStringifyConfig) {

}
