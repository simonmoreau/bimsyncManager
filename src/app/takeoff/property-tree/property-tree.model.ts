import { Property } from '../selected-properties.model';

export class PropertyNode {
    name: string;
    children?: PropertyNode[];
    property: Property;
}
