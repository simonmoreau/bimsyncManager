import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TakeoffService } from "./takeoff.services";
import {
    IProject,
    IModel,
    IRevision
} from "../bimsync-project/bimsync-project.models";
import {
    ITypeSummary, IProduct, IPropertySet, IProperty,
    IQuantitySet, DisplayProperty,
    IDisplayPropertySet, Products, ValueTree, Guid, GroupingModeEnum, SortEnum
} from "./takeoff.model";
import { DropEvent } from 'ng-drag-drop';
import {Observable} from 'rxjs/Rx';


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
    tableLoading: boolean = false;
    modelLoading: boolean = true;
    viewer3dToken: string;
    spaces: number[] = [];

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
        this.selectedValueProperties.length = 0;
        this.listOfRows.length = 0;
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
        this.selectedValueProperties.length = 0;
        this.listOfRows.length = 0;
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
        this.selectedValueProperties.length = 0;
        this.listOfRows.length = 0;
        this.viewer3dToken = null;
// spaces
        let viewerToken = this._takeoffService.getViewer3dToken(this.selectedProject.id,this.selectedRevision.id);

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

                    let spaceClass = this.ifcClasses.filter(function (x) {
                        return x.typeName === "IfcSpace";
                    })[0];

                    let spacesProductsObs = this._takeoffService.getProducts(
                        this.selectedProject.id,
                        this.selectedRevision.id,
                        spaceClass.typeName,
                        spaceClass.typeQuantity
                    );

                    //Use the two observables to launch the viewer
                    Observable.forkJoin([viewerToken, spacesProductsObs]).subscribe(results => {
                        // results[0] is our viewerToken
                        // results[1] is our spacesProducts
                        
                        let spacesProducts: IProduct[] = results[1];
                        spacesProducts.forEach(product => {
                            this.spaces.push(product.objectId);
                        });
                        this.viewer3dToken = results[0].token;
                      });
                },
                error => (this.errorMessage = <any>error)
            );
        return false;
    }

    GetProducts() {
        this.selectedValueProperties.length = 0;
        this.listOfRows.length = 0;
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
        this.selectedValueProperties.length = 0;
        this.listOfRows.length = 0;

        this.displayedPropertySets.length = 0;

        let displayedPropertyMainSet: IDisplayPropertySet = { name: 'Identification', properties: [] }

        let objectNameProperty: DisplayProperty = new DisplayProperty('Name', 'string', "", ['attributes', 'Name', 'value']);

        if (Products.GetPropertyValueFromPath(['attributes', 'Name', 'value'], product)) {
            displayedPropertyMainSet.properties.push(objectNameProperty);
        }

        let objectTypeProperty: DisplayProperty = new DisplayProperty('Type', 'string', "", ['attributes', 'ObjectType', 'value']);

        if (Products.GetPropertyValueFromPath(['attributes', 'ObjectType', 'value'], product)) {
            displayedPropertyMainSet.properties.push(objectTypeProperty);
        }

        let objectClassProperty: DisplayProperty = new DisplayProperty('Entity', 'string', "", ['ifcType']);

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
                    property.nominalValue.unit,
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
                let quantity: IProperty = quantitySet.quantities[quantityKey] as IProperty;
                let icon = quantity.nominalValue.type === 'string' ? 'text' : 'slider';
                let displayProperty: DisplayProperty = new DisplayProperty(
                    quantityKey,
                    quantity.nominalValue.type,
                    quantity.nominalValue.unit,
                    ['quantitySets', quantitySetKey, 'quantities', quantityKey, 'value', 'value']
                );
                displayedQuantitySet.properties.push(displayProperty);
            });
            this.displayedPropertySets.push(displayedQuantitySet);
        });
    }

    onTreeSelectionChange(displayProperty: DisplayProperty) {
        if (!displayProperty.enable) {
            this.selectedValueProperties = this.selectedValueProperties.filter(e => e.guid !== displayProperty.guid);
            this.RemovePropertyFromColumns(displayProperty);
        } else {
            this.AddPropertyToColumns(displayProperty);
        }
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
        if (e.dragData.enable) {
            this.AddPropertyToColumns(e.dragData);
            this.GetGroupedPropertyCount();
        } else {
            e.dragData.enable = true;
        }
    }

    onValueLabelClose(property: DisplayProperty) {

        // Remove property from the tree
        let displayedPropertiesList: DisplayProperty[] = [];
        this.displayedPropertySets.map(s => displayedPropertiesList = displayedPropertiesList.concat(s.properties));
        let selectedValueProperty: DisplayProperty[] = this.selectedValueProperties.filter(e => e.guid === property.guid);
        if (selectedValueProperty.length === 1) {
            displayedPropertiesList = displayedPropertiesList.filter(e => e.guid === property.guid);
            displayedPropertiesList[0].enable = false
        }

        // Remove property from the columns
        this.RemovePropertyFromColumns(property);

        this.GetGroupedPropertyCount();
    }

    onSelectedValueUpdate(property: DisplayProperty, updatedProperty: DisplayProperty) {
        this.GetGroupedPropertyCount();
    }

    AddPropertyToColumns(displayProperty: DisplayProperty) {
        let clone: DisplayProperty = Object.create(displayProperty);
        clone.columnGuid = Guid.newGuid();
        this.selectedValueProperties.push(clone);

        this.UpdatePropertiesRank();
    }

    RemovePropertyFromColumns(displayProperty: DisplayProperty) {
        let index = this.selectedValueProperties.indexOf(displayProperty, 0);
        if (index > -1) {
            this.selectedValueProperties.splice(index, 1);
        }

        this.UpdatePropertiesRank();
    }

    UpdatePropertiesRank() {

        if (this.selectedValueProperties && this.selectedValueProperties.length !== 0) {
            this.selectedValueProperties.forEach(property => {
                property.isFirst = false;
                property.isLast = false;
            });

            const lastindex = this.selectedValueProperties.length - 1;
            this.selectedValueProperties[0].isFirst = true;
            this.selectedValueProperties[lastindex].isLast = true;
        }

    }

    onRankUpdated(property: DisplayProperty, rank: SortEnum) {
        let index = this.selectedValueProperties.indexOf(property, 0);
        if (index > -1) {
            this.selectedValueProperties.splice(index, 1);

            switch (+rank) {
                case SortEnum.Up: {
                    this.selectedValueProperties.splice(index - 1, 0, property);
                    break;
                }
                case SortEnum.Down: {
                    this.selectedValueProperties.splice(index + 1, 0, property);
                    break;
                }
                case SortEnum.ToTop: {
                    this.selectedValueProperties.splice(0, 0, property);
                    break;
                }
                case SortEnum.ToBottom: {
                    this.selectedValueProperties.push(property);
                    break;
                }
            }
        }

        this.UpdatePropertiesRank();
        this.GetGroupedPropertyCount();
    }

    onModelLoaded() {
        this.modelLoading = false;
    }

    GetGroupedPropertyCount(): any {

        if (this.selectedValueProperties && this.selectedValueProperties.length !== 0) {
            this.tableLoading = true;
            const promise = this.ProcessData();
            promise.then(() => {
                this.tableLoading = false;
            });
        } else {
            this.listOfRows.length = 0;
        }
    }

    async ProcessData(): Promise<void> {
        this.listOfRows.length = 0;

        // Get the first column
        let propertyArray = Products.GetGroupedList(this.selectedValueProperties[0], this.selectedProducts);

        // Create the tree
        let tree: ValueTree[] = [];

        propertyArray.forEach(value => {
            let filteredProducts = Products.GetFilteredProducts(
                this.selectedProducts,
                this.selectedValueProperties[0].path,
                value
            );

            tree.push(new ValueTree(
                value,
                0,
                this.selectedValueProperties,
                filteredProducts
            ));
        });

        // Create the rows
        let rows = [];

        tree.forEach(treeItem => {
            rows = rows.concat(treeItem.rows);
        });

        this.listOfRows = rows;
    }

    trackByFn(index, model) {
        return model.id;
    }

    DownloadData() {

        if (this.listOfRows.length !== 0) {

            let csvContent = 'data:text/csv;charset=utf-8,';

            // first row
            let firstRow = '';
            this.selectedValueProperties.forEach(selectedValueProperty => {
                firstRow = firstRow + selectedValueProperty.displayName + ',';
            })
            csvContent += firstRow + '\r\n';

            this.listOfRows.forEach(rowArray => {
                let row = '';

                Object.keys(rowArray).forEach(key => {
                    row = row + rowArray[key] + ',';
                });

                csvContent += row + '\r\n';
            });

            let encodedUri = encodeURI(csvContent);
            let link = document.createElement('a');
            link.setAttribute('href', encodedUri);

            let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            let dateString = new Date().toLocaleDateString("en-US", options)

            link.setAttribute('download', dateString + '_' + this.selectedIfcClass.typeName + '.csv');
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "my_data.csv".
        }

        // console.log("download data as spreadsheet");
    }
}
