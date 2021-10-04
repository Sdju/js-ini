import { promises as fs } from 'fs';
import { IParseConfig, parse } from '../index';

export async function readIniFile(path: string, config: IParseConfig) {
  const data = await fs.readFile(path, 'utf-8');
  return parse(data, config);
}
