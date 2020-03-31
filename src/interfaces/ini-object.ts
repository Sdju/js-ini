import { $Errors, ParsingError } from '../errors';
import { IIniObjectSection } from './ini-object-section';

export interface IIniObject extends IIniObjectSection {
  [$Errors]?: ParsingError[];
}
