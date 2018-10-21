import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TakeoffService } from "./takeoff.services";
import {
    IProject,
    IModel,
    IRevision
} from "../bimsync-project/bimsync-project.models";
import { ITypeSummary, IProduct, IPropertySet, IProperty,
    IQuantitySet, IDisplayProperty,
    IDisplayPropertySet, GroupingMode } from "./takeoff.model";
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
    selectedValueProperties: IDisplayProperty[] = [];
    selectedFilterProperties: IDisplayProperty[] = [];
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

        let objectNameProperty: IDisplayProperty = {
            name: 'Name',
            enable: false,
            icon: 'text',
            path: ['attributes', 'Name', 'value'],
            groupingMode: GroupingMode.DontSummarize
        };
        if (this.GetPropertyValueFromPath(['attributes', 'Name', 'value'], product)) {
            displayedPropertyMainSet.properties.push(objectNameProperty);
        }

        let objectTypeProperty: IDisplayProperty = {
            name: 'Type',
            enable: false,
            icon: 'text',
            path: ['attributes', 'ObjectType', 'value'],
            groupingMode: GroupingMode.DontSummarize
        };
        if (this.GetPropertyValueFromPath(['attributes', 'ObjectType', 'value'], product)) {
            displayedPropertyMainSet.properties.push(objectTypeProperty);
        }

        let objectClassProperty: IDisplayProperty = {
            name: 'Entity',
            enable: false,
            icon: 'text',
            path: ['ifcType'],
            groupingMode: GroupingMode.DontSummarize
        };
        if (product.ifcType) { displayedPropertyMainSet.properties.push(objectClassProperty); }

        this.displayedPropertySets.push(displayedPropertyMainSet);

        Object.keys(product.propertySets).forEach(propertySetKey => {
            let propertySet = product.propertySets[propertySetKey] as IPropertySet;
            let displayedPropertySet: IDisplayPropertySet = { name: propertySet.attributes.Name.value, properties: [] }
            Object.keys(propertySet.properties).forEach(propertyKey => {
                let property: IProperty = propertySet.properties[propertyKey] as IProperty;
                let icon = property.nominalValue.type === 'string' ? 'text' : 'slider';
                let displayProperty: IDisplayProperty = {
                    name: propertyKey,
                    enable: false,
                    icon: icon,
                    path: ['propertySets', propertySetKey, 'properties', propertyKey, 'nominalValue', 'value'],
                    groupingMode: GroupingMode.DontSummarize
                };
                displayedPropertySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedPropertySet);
        });


        Object.keys(product.quantitySets).forEach(quantitySetKey => {
            let quantitySet = product.quantitySets[quantitySetKey] as IQuantitySet;
            let displayedQunatitySet: IDisplayPropertySet = { name: quantitySet.attributes.Name.value, properties: [] }
            Object.keys(quantitySet.quantities).forEach(quantityKey => {
                let property: IProperty = quantitySet.quantities[quantityKey] as IProperty;
                let icon = property.nominalValue.type === 'string' ? 'text' : 'slider';
                let displayProperty: IDisplayProperty = {
                    name: quantityKey,
                    enable: false,
                    icon: icon,
                    path: ['quantitySets', quantitySetKey, 'quantities', quantityKey, 'value', 'value'],
                    groupingMode: GroupingMode.DontSummarize
                };
                displayedQunatitySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedQunatitySet);
        });

        console.log(this.displayedPropertySets);
    }

    onTreeSelectionChange(e: IDisplayProperty) {
        this.UpdateSelectedValueProperties(e);
        this.GetGroupedPropertyCount();
    }

    onFilterPropertyDrop(e: DropEvent) {
        this.selectedFilterProperties.push(e.dragData);
    }

    onFilterLabelClick(e: IDisplayProperty) {
        let index = this.selectedFilterProperties.indexOf(e, 0);
        if (index > -1) {
            this.selectedFilterProperties.splice(index, 1);
        }
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

    GetGroupedList(selectedProperty: IDisplayProperty): any {

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        let allPropertyValuesList = this.selectedProducts.map(product => {
            return this.GetPropertyValueFromPath(selectedProperty.path, product);
          });

          switch (selectedProperty.groupingMode) {
            case GroupingMode.DontSummarize: {
                return allPropertyValuesList.filter(onlyUnique);
            }
            case GroupingMode.Count: {
                return allPropertyValuesList.length;
            }
            case GroupingMode.CountDistinct: {
                return allPropertyValuesList.filter(onlyUnique).length;
            }
            case GroupingMode.First: {
                return allPropertyValuesList.filter(onlyUnique).sort()[0];
            }
            case GroupingMode.First: {
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
