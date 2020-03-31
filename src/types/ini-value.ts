import { IIniObjectDataSection } from './ini-object-data-section';
import { IIniObjectSection } from '../interfaces/ini-object-section';

export type IniValue = string | number | boolean | IIniObjectSection | IIniObjectDataSection;
