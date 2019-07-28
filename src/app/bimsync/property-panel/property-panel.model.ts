import { Product } from 'src/app/shared/models/bimsync.model';

export class IPanelData {
    name: string;
    entity: string;
    guid: string;
    type: string;
    properties: Property[];
    quantities: Property[];
    materials: string;

    constructor(products: Product[]) {
        if (products.length === 1) {
            const product = products[0];
            this.name = product.attributes['Name'].value;
            this.entity = product.ifcType;
            this.guid = product.attributes['GlobalId'].value;
            this.type = product.attributes['ObjectType'].value;
        }
    }
}

class Property {
    name: string;
    value: string;
    unit: string;
}
