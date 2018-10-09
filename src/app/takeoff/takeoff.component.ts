import { Component, OnInit } from "@angular/core";
import { TakeoffService } from "./takeoff.services";
import {
    IProject,
    IModel,
    IRevision
} from "../bimsync-project/bimsync-project.models";
import { ITypeSummary, IProduct, IPropertySet, IQuantitySet, IDisplayProperty, IDisplayPropertySet } from "./takeoff.model";
import { DropEvent } from 'ng-drag-drop';

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
    groupedProperties: any = {};
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
        if (product.attributes['Name']['value']) { displayedPropertyMainSet.properties.push(objectNameProperty); }

        let objectTypeProperty: IDisplayProperty = {
            name: 'Type',
            enable: false,
            path: ['attributes', 'ObjectType', 'value']
        };
        if (product.attributes['ObjectType']['value']) { displayedPropertyMainSet.properties.push(objectTypeProperty); }

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
    }

    onValuePropertyDrop(e: DropEvent) {
        e.dragData.enable = true;
    }

    onValueLabelClick(e: IDisplayProperty) {
        e.enable = false;
    }

    onRowPropertyDrop(e: DropEvent) {
        this.selectedRowProperty = e.dragData;
        this.GetGroupedPropertyCount();
    }

    onRowLabelClick() {
        this.selectedRowProperty = null;
        this.GetGroupedPropertyCount();
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

        this.GetGroupedPropertyCount();

    }


    GetGroupedPropertyCount(): any {

        let products = this.selectedProducts;
        let groupingPropertyPath: string[];
        if (this.selectedRowProperty) {groupingPropertyPath = this.selectedRowProperty.path;}
        let groupedPropertiesPath: string[];
        if (this.selectedValueProperties.length) { groupedPropertiesPath = this.selectedValueProperties[0].path;}
        
        this.groupedProperties = {};

        for (let i = 0; i < products.length; i++) {

            // How to properly round the value if it is a number ?
            let groupingPropertyValue = this.GetPropertyFromPath(groupingPropertyPath, products[i]);
            let groupedPropertyValue = null;
            if (groupedPropertiesPath)  { groupedPropertyValue = this.GetPropertyFromPath(groupedPropertiesPath, products[i]);}

            this.groupedProperties[groupingPropertyValue] = this.groupedProperties[groupingPropertyValue] ?
                this.groupedProperties[groupingPropertyValue] + 1 : 1;
        }
    }

    GetPropertyFromPath(path: string[], object: any): any {
        return path.reduce((acc, currValue) => (acc && acc[currValue]) ? acc[currValue] : null
            , object)
    }



    trackByFn(index, model) {
        return model.id;
    }
}
