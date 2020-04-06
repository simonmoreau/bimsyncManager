import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SelectedPropertiesService } from '../selected-properties.service';
import { IPropertiesList, DisplayedQuantityProperty } from '../selected-properties.model';
import { Property } from '../../shared/models/bimsync.model';



interface DataSourceObject {
  [key: string]: any
}

export class TableColumn {

  constructor(name:string,displayedName:string){
    this.name = name;
    this.displayedName = displayedName;
  }
  name: string;
  displayedName: string;
}

@Component({
  selector: 'app-quantities',
  templateUrl: './quantities.component.html',
  styleUrls: ['./quantities.component.scss']
})
export class QuantitiesComponent implements OnInit {

  selectedValueProperties: IPropertiesList;
  filteredFilterProperties: IPropertiesList;

  columns: TableColumn[];
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private selectedPropertiesService: SelectedPropertiesService) {
    this.selectedValueProperties = selectedPropertiesService.ValueProperties;
    this.filteredFilterProperties = selectedPropertiesService.FilterProperties;
  }

  // Create observer object when the list of properties changes
  onPropertiesListChange = {
    next: (propertiesList => {
      if (propertiesList.length !== 0) {
        if (this.selectedPropertiesService.Products) {

          // build the quantityData object to be passed as data source
          const quantityData = this.selectedPropertiesService.Products.map(p => {
            const dataSourceObject: DataSourceObject = {};
            propertiesList.forEach(property => {
              dataSourceObject[property.id] = this.GetValueByString(p,property.path)
            });
            return dataSourceObject;
          });

          // Regroup data in the quantityData object
          const test = this.GroupDataInArray(quantityData,propertiesList);
          console.log(test);

          // build an array of string for displayedColumns
          this.displayedColumns = propertiesList.map(p => p.id);
          this.columns = propertiesList.map(p => new TableColumn(p.id, p.GetDisplayedName()));

          // initialize the data source
          this.dataSource = new MatTableDataSource(quantityData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.pageSizeOptions = [5];
        }
      }
      else {
        this.displayedColumns = null;
        this.columns = null;
        this.dataSource = null;
      }
    }),
    error: err => console.log(err),
    complete: () => console.log('Observer got a complete notification'),
  };

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSizeOptions = [5];
    this.selectedValueProperties.propertiesListChange.subscribe(this.onPropertiesListChange);
  }

  // Get the value of a property from its path
  private GetValueByString(o:object, s:string) : any {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
  }

  onlyUnique = function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

  private GroupDataInArray(dataSourceObjects: DataSourceObject[], propertiesList : DisplayedQuantityProperty[]):DataSourceObject[] {

    // get the first column unique values
    const firstColumnUniqueValues:any[] = dataSourceObjects.map(qo => qo[propertiesList[0].id]).filter(this.onlyUnique);

    const resultingDataSourceObjects: DataSourceObject[] = [];

    firstColumnUniqueValues.forEach(firstColumnUniqueValue => {

      // get an array of dataSourceObject for each value of the first column
      const filteredDataSourceObjects = dataSourceObjects.filter(ds => ds[propertiesList[0].id] === firstColumnUniqueValue);

      // Create a new DataSourceObject with these arrays
      const dataSourceObject: DataSourceObject = {};

      dataSourceObject[propertiesList[0].id] = firstColumnUniqueValue;

      for (let index = 1; index < propertiesList.length; index++) {
        dataSourceObject[propertiesList[index].id] = filteredDataSourceObjects.map(o => o[propertiesList[index].id]);
      }

      resultingDataSourceObjects.push(dataSourceObject);
    });

    return resultingDataSourceObjects;
  }

  private AggregateGroupedData(dataSourceObjects: DataSourceObject[], propertiesList : DisplayedQuantityProperty[]):DataSourceObject[] {


    dataSourceObjects.forEach(dataSourceObject => {
      for (let index = 1; index < propertiesList.length; index++) {
        dataSourceObject[propertiesList[index].id] = dataSourceObject[propertiesList[index].id];
      }
    });

    return dataSourceObjects;

  }
}