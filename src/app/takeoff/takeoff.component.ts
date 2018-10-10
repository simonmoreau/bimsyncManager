import { Component, OnInit } from "@angular/core";
import { TakeoffService } from "./takeoff.services";
import {
    IProject,
    IModel,
    IRevision
} from "../bimsync-project/bimsync-project.models";
import { ITypeSummary, IProduct, IPropertySet, IQuantitySet, IDisplayProperty, IDisplayPropertySet, IGroupedProperty } from "./takeoff.model";
import { DropEvent } from 'ng-drag-drop';
import { retry } from "rxjs/operators";

@Component({
    selector: "app-takeoff",
    templateUrl: "./takeoff.component.html",
    styleUrls: ["./takeoff.component.scss"],
    providers: [TakeoffService]
})
export class TakeoffComponent implements OnInit {
    projects: IProject[] = [];
    selectedProject: IProject;
    models: IModel[] = [];
    revisions: IRevision[] = [];
    selectedModel: IModel;
    selectedRevision: IRevision;
    errorMessage: string;
    ifcClasses: ITypeSummary[] = [];
    selectedIfcClass: ITypeSummary;
    selectedProducts: IProduct[] = [];
    selectedProductsLoading: boolean = false;
    displayedPropertySets: IDisplayPropertySet[] = [];
    selectedValueProperties: IDisplayProperty[] = [];
    selectedRowProperty: IDisplayProperty;
    listOfGroupedProperty: IGroupedProperty[] = [];
    objectKeys = Object.keys;

    constructor(private _takeoffService: TakeoffService) { }

    ngOnInit() {
        this.GetProjects();
    }

    GetProjects() {
        this._takeoffService.getProjects().subscribe(
            projects => {
                this.projects = projects;
            },
            error => (this.errorMessage = <any>error)
        );
        return false;
    }

    GetModels() {
        this._takeoffService.getModels(this.selectedProject.id).subscribe(
            models => {
                this.models = models;
                if (this.models != null && this.models.length !== 0) {
                    this.selectedModel = this.models[0];
                    this.GetRevisions();
                } else {
                    this.selectedModel = null;
                }
            },
            error => (this.errorMessage = <any>error)
        );
        return false;
    }

    GetRevisions() {
        this._takeoffService
            .getRevisions(this.selectedProject.id, this.selectedModel.id)
            .subscribe(
                revisions => {
                    this.revisions = revisions;
                    if (this.revisions != null && this.revisions.length !== 0) {
                        this.selectedRevision = this.revisions[0];
                        this.GetProductTypeSummary();
                    } else {
                        this.selectedRevision = null;
                    }
                },
                error => (this.errorMessage = <any>error)
            );
        return false;
    }

    GetProductTypeSummary() {
        this._takeoffService
            .getProductsTypeSummary(
                this.selectedProject.id,
                this.selectedRevision.id
            )
            .subscribe(
                summaryData => {
                    this.ifcClasses.length = 0;
                    Object.keys(summaryData).forEach(key => {
                        let summary: ITypeSummary = {
                            typeName: key,
                            typeQuantity: summaryData[key]
                        };

                        this.ifcClasses.push(summary);
                    });
                    this.selectedIfcClass = this.ifcClasses.filter(function (x) {
                        return x.typeName === "IfcProject";
                    })[0];

                    this.GetProducts();
                },
                error => (this.errorMessage = <any>error)
            );
        return false;
    }

    GetProducts() {
        this.selectedProducts.length = 0;
        this.selectedProductsLoading = true;
        // It will loop on all requests
        this._takeoffService
            .getProducts(
                this.selectedProject.id,
                this.selectedRevision.id,
                this.selectedIfcClass.typeName,
                this.selectedIfcClass.typeQuantity
            )
            .subscribe(
                products => {
                    this.selectedProducts = this.selectedProducts.concat(
                        products
                    );
                },
                error => (this.errorMessage = <any>error),
                () => {
                    this.selectedProductsLoading = false;
                    this.GetProductProperties(this.selectedProducts[0]);
                    this.selectedValueProperties.length = 0;
                }
            );
        return false;
    }

    GetProductProperties(product: IProduct) {

        this.displayedPropertySets.length = 0;

        let displayedPropertyMainSet: IDisplayPropertySet = { name: 'Identification', properties: [] }

        let objectNameProperty: IDisplayProperty = {
            name: 'Name',
            enable: false,
            path: ['attributes', 'Name', 'value']
        };
        if (this.GetPropertyValueFromPath(['attributes', 'Name', 'value'], product)) { displayedPropertyMainSet.properties.push(objectNameProperty); }

        let objectTypeProperty: IDisplayProperty = {
            name: 'Type',
            enable: false,
            path: ['attributes', 'ObjectType', 'value']
        };
        if (this.GetPropertyValueFromPath(['attributes', 'ObjectType', 'value'], product)) { displayedPropertyMainSet.properties.push(objectTypeProperty); }

        let objectClassProperty: IDisplayProperty = {
            name: 'Entity',
            enable: false,
            path: ['ifcType']
        };
        if (product.ifcType) { displayedPropertyMainSet.properties.push(objectClassProperty); }

        this.displayedPropertySets.push(displayedPropertyMainSet);

        Object.keys(product.propertySets).forEach(propertySetKey => {
            let propertySet = product.propertySets[propertySetKey] as IPropertySet;
            let displayedPropertySet: IDisplayPropertySet = { name: propertySet.attributes.Name.value, properties: [] }
            Object.keys(propertySet.properties).forEach(propertyKey => {
                // let property: IProperty = propertySet.properties[propertyKey] as IProperty;
                let displayProperty: IDisplayProperty = {
                    name: propertyKey,
                    enable: false,
                    path: ['propertySets', propertySetKey, 'properties', propertyKey, 'nominalValue', 'value']
                };
                displayedPropertySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedPropertySet);
        });


        Object.keys(product.quantitySets).forEach(quantitySetKey => {
            let quantitySet = product.quantitySets[quantitySetKey] as IQuantitySet;
            let displayedQunatitySet: IDisplayPropertySet = { name: quantitySet.attributes.Name.value, properties: [] }
            Object.keys(quantitySet.quantities).forEach(quantityKey => {
                // let property: IProperty = propertySet.properties[propertyKey] as IProperty;
                let displayProperty: IDisplayProperty = {
                    name: quantityKey,
                    enable: false,
                    path: ['quantitySets', quantitySetKey, 'quantities', quantityKey, 'value', 'value']
                };
                displayedQunatitySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedQunatitySet);
        });

        console.log(this.displayedPropertySets);
    }

    onTreeSelectionChange(e: IDisplayProperty) {
        this.UpdateSelectedValueProperties(e);
        this.selectedRowProperty = this.selectedValueProperties[0] ? this.selectedValueProperties[0] : null;
        this.GetGroupedPropertyCount();
    }

    onValuePropertyDrop(e: DropEvent) {
        e.dragData.enable = true;
    }

    onValueLabelClick(e: IDisplayProperty) {
        e.enable = false;
    }

    UpdateSelectedValueProperties(selectedDisplayedProperty: IDisplayProperty) {
        if (selectedDisplayedProperty.enable) {
            this.selectedValueProperties.push(selectedDisplayedProperty);
        } else {
            let index = this.selectedValueProperties.indexOf(selectedDisplayedProperty, 0);
            if (index > -1) {
                this.selectedValueProperties.splice(index, 1);
            }
        }

        if (!this.selectedRowProperty) {
            this.selectedRowProperty = {
                name: 'Entity',
                enable: false,
                path: ['ifcType']
            };
        }

        this.GetGroupedPropertyCount();

    }


    GetGroupedPropertyCount(): any {

        if (this.selectedRowProperty) {
            let products = this.selectedProducts;

            let groupedProperties = {};
            

            for (let i = 0; i < products.length; i++) {

                let groupingPropertyValue = this.GetPropertyValueFromPath(this.selectedRowProperty.path, products[i]);

                for (let j = 0; j < this.selectedValueProperties.length; j++) {
                    let selectedValuePropertyValue = this.GetPropertyValueFromPath(this.selectedValueProperties[j].path, products[i]);

                    let addedValue: number = 1;
                    if (typeof selectedValuePropertyValue === "number") { addedValue = selectedValuePropertyValue; }

                    if (groupedProperties[groupingPropertyValue]) {
                        if (groupedProperties[groupingPropertyValue][this.selectedValueProperties[j].name]) {
                            groupedProperties[groupingPropertyValue][this.selectedValueProperties[j].name]
                                = groupedProperties[groupingPropertyValue][this.selectedValueProperties[j].name] + addedValue;
                        } else {
                            groupedProperties[groupingPropertyValue][this.selectedValueProperties[j].name] = addedValue;
                        }
                    }
                    else {
                        groupedProperties[groupingPropertyValue] = {};
                        groupedProperties[groupingPropertyValue][this.selectedValueProperties[j].name] = addedValue;
                    }
                }
            }
            
            let tempListOfGroupedProperty: IGroupedProperty[] = [];

            Object.keys(groupedProperties).forEach(function (groupedProperty) {

                let newGroupedProperty: IGroupedProperty = {
                    name: groupedProperty,
                }

                Object.keys(groupedProperties[groupedProperty]).forEach(function (valueProperty) {
                    newGroupedProperty[valueProperty] = groupedProperties[groupedProperty][valueProperty];
                });

                tempListOfGroupedProperty.push(newGroupedProperty);
            });

            this.listOfGroupedProperty = tempListOfGroupedProperty;
        } else {
            this.listOfGroupedProperty.length = 0;
        }
    }

    GetPropertyValueFromPath(path: string[], object: any): any {
        return path.reduce((acc, currValue) => (acc && acc[currValue]) ? acc[currValue] : null
            , object)
    }



    trackByFn(index, model) {
        return model.id;
    }
}
