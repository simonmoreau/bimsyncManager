import { Product, Property as BimsyncProperty, Quantity as BimsyncQuantity, Value } from 'src/app/shared/models/bimsync.model';

export class IPanelData {
    identification: Property[];
    properties: Set[];
    quantities: Set[];
    materials: Set[];

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
            if (products[0].type) {
                const typePSet = products[0].type.propertySets;
                Object.keys(typePSet).forEach(key => { pSet[key] = products[0].type.propertySets[key]; });
            }
            console.log(pSet);
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
                        propertiesList.push({ name: propertyKey, value: displayedValue, unit: property.nominalValue.unit });
                    }
                });
                if (propertiesList.length > 0) {
                    PropSets.push({ name: propertySetKey, properties: propertiesList });
                }
            });

            this.properties = PropSets;

            // Create QuantitySets properties
            const qSet = products[0].quantitySets;
            if (products[0].type) {
                const typeQSet = products[0].type.quantitySets;
                Object.keys(typeQSet).forEach(key => { qSet[key] = products[0].type.quantitySets[key]; });
            }
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
                    quantitiesList.push({ name: quantityKey, value: displayedValue, unit: quantity.value.unit });
                });
                QuantSets.push({ name: quantitySetKey, properties: quantitiesList });
            });

            this.quantities = QuantSets;

            // Create materials properties
            const bimsyncMaterials = products[0].materials;
            const materialSets: Set[] = new Array();
            bimsyncMaterials.forEach(bimsyncMaterial => {
                if (bimsyncMaterial.attributes['ForLayerSet']) {
                    const layerSetName = bimsyncMaterial.attributes['ForLayerSet'].value.attributes.LayerSetName.value;
                    const materialLayers: Value[] = bimsyncMaterial.attributes['ForLayerSet'].value.attributes.MaterialLayers.value;
                    const materialList: Property[] = new Array();
                    materialLayers.forEach(materialLayer => {
                        materialList.push({
                            name: materialLayer.value.attributes['Material'].value.attributes['Name'].value,
                            value: materialLayer.value.attributes['LayerThickness'].value,
                            unit: materialLayer.value.attributes['LayerThickness'].unit }
                        );
                    });
                    materialSets.push({ name: layerSetName, properties: materialList });
                } else if (bimsyncMaterial.attributes['Name']) {
                    const materialList: Property[] = new Array();
                    materialList.push({
                        name: 'Name',
                        value: bimsyncMaterial.attributes['Name'].value,
                        unit: ''
                    });
                    materialSets.push({ name: 'Material', properties: materialList });
                } else if (bimsyncMaterial.attributes['Materials']) {
                    const materialList: Property[] = new Array();
                    const materials: Value[] = bimsyncMaterial.attributes['Materials'].value;
                    let i = 1;
                    materials.forEach(material => {
                        materialList.push({
                            name: 'Material ' + i,
                            value: material.value.attributes['Name'].value,
                            unit: ''
                        });
                        i++;
                    });
                    materialSets.push({ name: 'Materials', properties: materialList });
                }
            });

            this.materials = materialSets;
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
