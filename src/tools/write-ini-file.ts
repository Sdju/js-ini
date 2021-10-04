import { promises as fs } from 'fs';
import { IStringifyConfig, stringify } from '../index';
import { IIniObject } from '../interfaces/ini-object';

export async function writeIniFile(path: string, ini: IIniObject, config: IStringifyConfig) {
  const data = await stringify(ini, config);
  return fs.writeFile(path, data, 'utf-8');
}
