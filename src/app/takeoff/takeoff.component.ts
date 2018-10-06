import { Component, OnInit } from "@angular/core";
import { TakeoffService } from "./takeoff.services";
import {
    IProject,
    IModel,
    IRevision
} from "../bimsync-project/bimsync-project.models";
import { ITypeSummary, IProduct, IPropertySet, IQuantitySet, IDisplayProperty, IDisplayPropertySet } from "./takeoff.model";

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
    selectedProperties: IDisplayProperty[] = [];
    groupedProperties: any;
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
                }
            );
        return false;
    }

    GetProductProperties(product: IProduct) {

        this.displayedPropertySets.length = 0;

        Object.keys(product.propertySets).forEach(propertySetKey => {
            let propertySet = product.propertySets[propertySetKey] as IPropertySet;
            let displayedPropertySet: IDisplayPropertySet = { name: propertySet.attributes.Name.value, properties: [] }
            Object.keys(propertySet.properties).forEach(propertyKey => {
                // let property: IProperty = propertySet.properties[propertyKey] as IProperty;
                let displayProperty: IDisplayProperty = { name: propertyKey, enable: false };
                displayedPropertySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedPropertySet);
        });


        Object.keys(product.quantitySets).forEach(quantitySetKey => {
            let quantitySet = product.quantitySets[quantitySetKey] as IQuantitySet;
            let displayedQunatitySet: IDisplayPropertySet = { name: quantitySet.attributes.Name.value, properties: [] }
            Object.keys(quantitySet.quantities).forEach(quantityKey => {
                // let property: IProperty = propertySet.properties[propertyKey] as IProperty;
                let displayProperty: IDisplayProperty = { name: quantityKey, enable: false };
                displayedQunatitySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedQunatitySet);
        });

        console.log(this.displayedPropertySets);
    }

    UpdateColumns() {
        this.selectedProperties.length = 0;

        this.displayedPropertySets.forEach(displayedPropertySet => {
            displayedPropertySet.properties.forEach(displayedProperty => {
                if (displayedProperty.enable) {
                    this.selectedProperties.push(displayedProperty);

                    this.GetGroupedPropertyCount(
                        this.selectedProducts,
                        displayedPropertySet.name,
                        displayedProperty.name,
                        displayedPropertySet.name,
                        displayedProperty.name,
                        )
                }
            });
        });
    }


    GetGroupedPropertyCount(
        value: IProduct[],
        groupingSetName: string,
        groupingPropertyName: string,
        setName: string,
        propertyName: string): any {

        // let groupedProperties: IGroupedProperty[] = [];
        this.groupedProperties = {};

        for (let i = 0; i < value.length; i++) {

            // TO DO Check everytime if the property actually exist and push the product to an "undified" property if not
            // TO DO Be able to find the proprety with any arbitrary path
            // cf https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
            let groupingPropertyValue =
                value[i]['propertySets'][groupingSetName]['properties'][groupingPropertyName]['nominalValue']['value'];
            let groupedPropertyValue =
                value[i]['propertySets'][setName]['properties'][propertyName]['nominalValue']['value'];

            this.groupedProperties[groupingPropertyValue] = this.groupedProperties[groupingPropertyValue] ?
                this.groupedProperties[groupingPropertyValue] + 1 : 1;

        }
    }

    trackByFn(index, model) {
        return model.id;
    }
}
