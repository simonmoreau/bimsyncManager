import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TakeoffService } from "./takeoff.services";
import {
    IProject,
    IModel,
    IRevision
} from "../bimsync-project/bimsync-project.models";
import { ITypeSummary, IProduct, IPropertySet, IProperty,
    IQuantitySet, DisplayProperty,
    IDisplayPropertySet, GroupingMode, GroupingModeEnum } from "./takeoff.model";
import { DropEvent } from 'ng-drag-drop';


@Component({
    selector: "app-takeoff",
    templateUrl: "./takeoff.component.html",
    styleUrls: ["./takeoff.component.scss"],
    providers: [TakeoffService]
})
export class TakeoffComponent implements OnInit {
    selectedProject: IProject;
    projectId: string;
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
    selectedValueProperties: DisplayProperty[] = [];
    selectedFilterProperties: DisplayProperty[] = [];
    listOfRows: any[] = [];

    constructor(private _takeoffService: TakeoffService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.projectId = this.route.snapshot.paramMap.get('id');
        this.GetProject();
    }

    GetProject() {
        this._takeoffService.getProject(this.projectId).subscribe(
            projects => {
                this.selectedProject = projects;
                this.GetModels();
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

        let objectNameProperty: DisplayProperty = new DisplayProperty('Name', 'string', ['attributes', 'Name', 'value']);

        if (this.GetPropertyValueFromPath(['attributes', 'Name', 'value'], product)) {
            displayedPropertyMainSet.properties.push(objectNameProperty);
        }

        let objectTypeProperty: DisplayProperty = new DisplayProperty('Type', 'string', ['attributes', 'ObjectType', 'value']);

        if (this.GetPropertyValueFromPath(['attributes', 'ObjectType', 'value'], product)) {
            displayedPropertyMainSet.properties.push(objectTypeProperty);
        }

        let objectClassProperty: DisplayProperty = new DisplayProperty('Entity', 'string', ['ifcType']);

        if (product.ifcType) { displayedPropertyMainSet.properties.push(objectClassProperty); }

        this.displayedPropertySets.push(displayedPropertyMainSet);

        Object.keys(product.propertySets).forEach(propertySetKey => {
            let propertySet = product.propertySets[propertySetKey] as IPropertySet;
            let displayedPropertySet: IDisplayPropertySet = { name: propertySet.attributes.Name.value, properties: [] }
            Object.keys(propertySet.properties).forEach(propertyKey => {
                let property: IProperty = propertySet.properties[propertyKey] as IProperty;
                let displayProperty: DisplayProperty = new DisplayProperty(
                    propertyKey,
                    property.nominalValue.type,
                    ['propertySets', propertySetKey, 'properties', propertyKey, 'nominalValue', 'value']
                );
                displayedPropertySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedPropertySet);
        });


        Object.keys(product.quantitySets).forEach(quantitySetKey => {
            let quantitySet = product.quantitySets[quantitySetKey] as IQuantitySet;
            let displayedQuantitySet: IDisplayPropertySet = { name: quantitySet.attributes.Name.value, properties: [] }
            Object.keys(quantitySet.quantities).forEach(quantityKey => {
                let property: IProperty = quantitySet.quantities[quantityKey] as IProperty;
                let icon = property.nominalValue.type === 'string' ? 'text' : 'slider';
                let displayProperty: DisplayProperty = new DisplayProperty(
                    quantityKey,
                    property.nominalValue.type,
                    ['quantitySets', quantitySetKey, 'quantities', quantityKey, 'value', 'value']
                );
                displayedQuantitySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedQuantitySet);
        });

        console.log(this.displayedPropertySets);
    }

    onTreeSelectionChange(e: DisplayProperty) {
        this.UpdateSelectedValueProperties(e);
        this.GetGroupedPropertyCount();
    }

    onFilterPropertyDrop(e: DropEvent) {
        this.selectedFilterProperties.push(e.dragData);
    }

    onFilterLabelClose(e: DisplayProperty) {
        let index = this.selectedFilterProperties.indexOf(e, 0);
        if (index > -1) {
            this.selectedFilterProperties.splice(index, 1);
        }
    }

    onValuePropertyDrop(e: DropEvent) {
        e.dragData.enable = true;
    }

    onValueLabelClose(e: DisplayProperty) {
        e.enable = false;
    }

    onSelectedValueUpdate(property: DisplayProperty) {
        console.log(property);
    }

    UpdatePropertyInList(property: DisplayProperty, list: DisplayProperty[]) {
        let index = list.indexOf(property, 0);
        if (index > -1) {
            list[index] = property;
        }
    }

    UpdateSelectedValueProperties(selectedDisplayedProperty: DisplayProperty) {
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

        if (this.selectedValueProperties && this.selectedValueProperties.length !== 0) {

            this.listOfRows.length = 0;

            let columns: any = {};
            this.selectedValueProperties.forEach(selectedValueProperty => {
                columns[selectedValueProperty.name] = this.GetGroupedList(selectedValueProperty);
            });
            let rows = [];

            for (let i = 0; i < columns[this.selectedValueProperties[0].name].length; i++) {
                let row: any = {};
                this.selectedValueProperties.forEach(selectedValueProperty => {
                    row[selectedValueProperty.name] = columns[selectedValueProperty.name][i];
                });
                rows.push(row);
            }

            this.listOfRows = rows;

        } else {
            this.listOfRows.length = 0;
        }
    }

    GetGroupedList(selectedProperty: DisplayProperty): any {

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        let allPropertyValuesList = this.selectedProducts.map(product => {
            return this.GetPropertyValueFromPath(selectedProperty.path, product);
          });

          switch (selectedProperty.groupingMode.mode) {
            case GroupingModeEnum.DontSummarize: {
                return allPropertyValuesList.filter(onlyUnique);
            }
            case GroupingModeEnum.Count: {
                return allPropertyValuesList.length;
            }
            case GroupingModeEnum.CountDistinct: {
                return allPropertyValuesList.filter(onlyUnique).length;
            }
            case GroupingModeEnum.First: {
                return allPropertyValuesList.filter(onlyUnique).sort()[0];
            }
            case GroupingModeEnum.Last: {
                let filteredValues = allPropertyValuesList.filter(onlyUnique).sort();
                return filteredValues[filteredValues.length];
            }
            default: {
                return allPropertyValuesList.filter(onlyUnique);
            }
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
