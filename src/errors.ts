export const $Errors: unique symbol = Symbol('Errors of parsing');

export class ParsingError extends Error {
  constructor(line: string, lineNumber: number) {
    super(`Unsupported type of line: [${lineNumber}]"${line}"`);
    this.line = line;
    this.lineNumber = lineNumber;
  }

  line: string;
  lineNumber: number;
}
