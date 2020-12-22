export class ProtoError extends Error {
  constructor(lineNumber: number) {
    super(`Unsupported section name "__proto__": [${lineNumber}]"`);
    this.lineNumber = lineNumber;
  }

  public lineNumber: number;
}
