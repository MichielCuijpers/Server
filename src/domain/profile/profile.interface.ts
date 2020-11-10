import { IReference } from '../reference/reference.interface';
import { ITagset } from '../tagset/tagset.interface';

export interface IProfile {
  id: number;
  references?: IReference[];
  tagsets?: ITagset[];
  avatar: string;
  description: string;
  restrictedTagsetNames?: string[];
}
