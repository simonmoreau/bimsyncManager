import { Product, Property as BimsyncProperty, Quantity as BimsyncQuantity } from 'src/app/shared/models/bimsync.model';

export class IPanelData {
    identification: Property[];
    properties: Set[];
    quantities: Set[];
    materials: string;

    constructor(products: Product[]) {
        if (products.length === 1) {
            

            const product = products[0];
            console.log(product);
            const identificationProps: Property[] = new Array();
            identificationProps.push({ name: 'Name', value: product.attributes['Name'].value, unit: '' });
            identificationProps.push({ name: 'Entity', value: product.ifcType, unit: '' });
            identificationProps.push({ name: 'GlobalId', value: product.attributes['GlobalId'].value, unit: '' });
            identificationProps.push({ name: 'ObjectType', value: product.attributes['ObjectType'].value, unit: '' });
            this.identification = identificationProps;

            // Create PropertySets properties
            const pSet = products[0].propertySets;
            const PropSets: Set[] = new Array();
            Object.keys(pSet).forEach(propertySetKey => {
                const propertiesList: Property[] = new Array();
                Object.keys(pSet[propertySetKey].properties).forEach(propertyKey => {
                    const property: BimsyncProperty = pSet[propertySetKey].properties[propertyKey];
                    if (property.nominalValue) {
                        let displayedValue = String(property.nominalValue.value);
                        if (property.nominalValue.type === 'number') {
                            let num: number = property.nominalValue.value as number;
                            num = Math.round(num * 1000) / 1000;
                            displayedValue = num.toString();
                        }
                        propertiesList.push({name: propertyKey, value: displayedValue, unit: property.nominalValue.unit });
                    }
                });
                if (propertiesList.length > 0) {
                    PropSets.push({name: propertySetKey, properties: propertiesList});
                }
            });

            if (PropSets.length > 0 ) { this.properties = PropSets;}

            // Create QuantitySets properties
            const qSet = products[0].quantitySets;
            const QuantSets: Set[] = new Array();
            Object.keys(qSet).forEach(quantitySetKey => {
                const quantitiesList: Property[] = new Array();
                Object.keys(qSet[quantitySetKey].quantities).forEach(quantityKey => {
                    const quantity: BimsyncQuantity = qSet[quantitySetKey].quantities[quantityKey];
                    let displayedValue = String(quantity.value.value);
                    if (quantity.value.type === 'number') {
                        let num: number = quantity.value.value as number;
                        num = Math.round(num * 1000) / 1000;
                        displayedValue = num.toString();
                    }
                    quantitiesList.push({name: quantityKey, value: displayedValue, unit: quantity.value.unit });
                });
                QuantSets.push({name: quantitySetKey, properties: quantitiesList});
            });

            this.quantities = QuantSets;

        }
    }
}

class Property {
    name: string;
    value: string;
    unit: string;
}

class Set {
    name: string;
    properties: Property[];
}
