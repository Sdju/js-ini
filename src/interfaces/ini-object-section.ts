import { IniValue } from '../types/ini-value';

export interface IIniObjectSection {
  [index: string]: IniValue;
}
