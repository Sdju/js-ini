// eslint-disable-next-line import/no-cycle
import { IniValue } from '../types/ini-value';

export interface IIniObjectSection {
  [index: string]: IniValue;
}
