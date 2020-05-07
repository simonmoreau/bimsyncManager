import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SelectedPropertiesService } from '../selected-properties.service';
import { IPropertiesList, DisplayedQuantityProperty } from '../selected-properties.model';
import { Property } from '../../shared/models/bimsync.model';
import { GroupingMode, GroupingModeEnum } from 'src/app/shared/models/quantities.model';
import { ThrowStmt } from '@angular/compiler';
import { DataSource } from '@angular/cdk/table';



interface DataSourceObject {
  [key: string]: any
}

interface DataTree {
  key: string;
  value: any;
  children: DataTree[];
}

export class TableColumn {

  constructor(name: string, displayedName: string) {
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
          let quantityData = this.selectedPropertiesService.Products.map(p => {
            const dataSourceObject: DataSourceObject = {};
            propertiesList.forEach(property => {
              dataSourceObject[property.id] = this.GetValueByString(p, property.path)
            });
            return dataSourceObject;
          });

          const dataTree: DataTree[] = this.BuildDataTree(quantityData, propertiesList, 0);

          quantityData = this.TransformDataTree(dataTree);

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
  private GetValueByString(o: object, s: string): any {
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

  removeDuplicates = function removeDuplicates(value, index, self) {
    return self.indexOf(value) === index;
  }

  average = function average(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
  }

  variance = function variance(array) {
    const avg = this.average(array);
    const squareDiffs = array.map((value) => (value - avg) * (value - avg));
    return this.average(squareDiffs);
  }

  round = function round(num: any): number {
    return Math.round(num * 100) / 100;
  }

  private BuildDataTree(dataSourceObjects: DataSourceObject[], properties: DisplayedQuantityProperty[], columnNumber: number): DataTree[] {

    // DataTree new list
    const dataTrees: DataTree[] = [];

    // get the column values
    const currentColumnvalues: any[] = this.AggregateList(
      dataSourceObjects.map(qo => qo[properties[columnNumber].id]),
      properties[columnNumber].groupingMode);

    currentColumnvalues.forEach(currentColumnValue => {

      let filteredDataSourceObjects = dataSourceObjects;
      if (properties[columnNumber].groupingMode.mode === GroupingModeEnum.DontSummarize) {
        // get an array of dataSourceObject for each value of the column
        filteredDataSourceObjects = dataSourceObjects.filter(ds => ds[properties[columnNumber].id] === currentColumnValue);
      }

      let childrenDataTrees: DataTree[] = [];
      if (columnNumber < properties.length - 1) {
        childrenDataTrees = this.BuildDataTree(filteredDataSourceObjects, properties, columnNumber + 1);
      }

      const dataTree: DataTree = {
        key: properties[columnNumber].id,
        value: currentColumnValue,
        children: childrenDataTrees
      };

      dataTrees.push(dataTree);
    });

    return dataTrees;
  }

  private TransformDataTree(dataTrees: DataTree[]): DataSourceObject[] {
    const dataSourceObjects: DataSourceObject[] = [];

    dataTrees.forEach(dataTree => {

      // Get a DataSourceObject for each children
      const dataSourceObject: DataSourceObject = {};

      if (dataTree.children.length === 0) {
        dataSourceObject[dataTree.key] = dataTree.value
        dataSourceObjects.push(dataSourceObject)
      }
      else {
        const childrenDataSourcesObjects: DataSourceObject[] = this.TransformDataTree(dataTree.children);

        childrenDataSourcesObjects.forEach(childrenDataSourcesObject => {
          childrenDataSourcesObject[dataTree.key] = dataTree.value;
          dataSourceObjects.push(childrenDataSourcesObject);
        });
      }
    });

    return dataSourceObjects
  }

  private AggregateList(sourceList: any[], groupingMode: GroupingMode): any[] {

    switch (groupingMode.mode) {
      case GroupingModeEnum.DontSummarize: {
        return sourceList.filter(this.removeDuplicates);
      }
      case GroupingModeEnum.Count: {
        return [sourceList.length];
      }
      case GroupingModeEnum.CountDistinct: {
        return [sourceList.filter(this.removeDuplicates).length];
      }
      case GroupingModeEnum.First: {
        return [sourceList.filter(this.removeDuplicates).sort()[0]];
      }
      case GroupingModeEnum.Last: {
        const filteredValues = sourceList.filter(this.removeDuplicates).sort();
        return [filteredValues[filteredValues.length - 1]];
      }
      case GroupingModeEnum.Sum: {
        return [sourceList.reduce((a, b) => a + b, 0)];
      }
      case GroupingModeEnum.Average: {
        return [this.average(sourceList)];
      }
      case GroupingModeEnum.Minimun: {
        return [sourceList.filter(this.removeDuplicates).sort()[0]];
      }
      case GroupingModeEnum.Maximun: {
        const filteredValues = sourceList.filter(this.removeDuplicates).sort();
        return [filteredValues[filteredValues.length - 1]];
      }
      case GroupingModeEnum.StandardDeviation: {
        return [Math.sqrt(this.variance(sourceList))];
      }
      case GroupingModeEnum.Variance: {
        return [this.variance(sourceList)];
      }
      case GroupingModeEnum.Median: {
        const arr = sourceList.sort((a, b) => a - b);
        let median = 0;
        if (arr.length % 2 === 1) {
          median = arr[(arr.length + 1) / 2 - 1];
        } else {
          median = (1 * arr[arr.length / 2 - 1] + 1 * arr[arr.length / 2]) / 2;
        }
        return [median]
      }
      default: {
        return sourceList.filter(this.removeDuplicates);
      }
    }
  }
}