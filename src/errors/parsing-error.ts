export class ParsingError extends Error {
  constructor(line: string, lineNumber: number) {
    super(`Unsupported type of line: [${lineNumber}] "${line}"`);
    this.line = line;
    this.lineNumber = lineNumber;
  }

  public line: string;

  public lineNumber: number;
}
