import { Component, OnInit } from "@angular/core";
import { TakeoffService } from "./takeoff.services";
import {
    IProject,
    IModel,
    IRevision
} from "../bimsync-project/bimsync-project.models";
import { ITypeSummary, IProduct, IPropertySet, IQuantitySet, IProperty, IQuantity } from "./takeoff.model";

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
    selectedElements: IProduct[] = [];
    selectedElementsLoading: boolean = false;

    constructor(private _takeoffService: TakeoffService) {}

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
                    this.selectedIfcClass = this.ifcClasses.filter(function(x) {
                        return x.typeName === "IfcProject";
                    })[0];

                    this.GetProducts();
                },
                error => (this.errorMessage = <any>error)
            );
        return false;
    }

    GetProducts() {
        this.selectedElements.length = 0;
        this.selectedElementsLoading = true;
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
                    this.selectedElements = this.selectedElements.concat(
                        products
                    );
                    this.selectedElementsLoading = false;
                    this.GetParameters(this.selectedElements[0]);
                },
                error => (this.errorMessage = <any>error)
            );
        return false;
    }

    GetParameters(product: IProduct) {
      let parameters: any[] = [];

      Object.keys(product.propertySets).forEach(propertySetKey => {
        let propertySet = product.propertySets[propertySetKey] as IPropertySet;
        Object.keys(propertySet.properties).forEach(propertyKey => {
          parameters.push(propertySet.properties[propertyKey] as IProperty);
        });
      });

      Object.keys(product.quantitySets).forEach(key => {
        let quantitySet = product.quantitySets[key] as IQuantitySet;
        Object.keys(quantitySet.quantities).forEach(quantityKey => {
          parameters.push(quantitySet.quantities[quantityKey] as IQuantity);
        });
      });

      console.log(parameters);
    }

    trackByFn(index, model) {
        return model.id;
    }
}
