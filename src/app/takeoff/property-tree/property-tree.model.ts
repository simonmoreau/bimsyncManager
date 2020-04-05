import { DisplayedQuantityProperty } from '../selected-properties.model';

export class PropertyNode {
    name: string;
    children?: PropertyNode[];
    property: DisplayedQuantityProperty;
}
