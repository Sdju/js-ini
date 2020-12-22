import { $Errors, ParsingError } from '../errors';
import { IIniObjectSection } from './ini-object-section';
import { $Proto } from '../proto';

export interface IIniObject extends IIniObjectSection {
  [$Errors]?: ParsingError[];
  [$Proto]?: IIniObjectSection;
}
