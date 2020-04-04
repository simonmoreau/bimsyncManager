import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SelectedPropertiesService } from '../selected-properties.service';
import { IPropertiesList } from '../selected-properties.model';
import { Property } from '../../shared/models/bimsync.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];

interface QuantityObject {
  [key: string]: any
}

@Component({
  selector: 'app-quantities',
  templateUrl: './quantities.component.html',
  styleUrls: ['./quantities.component.scss']
})
export class QuantitiesComponent implements OnInit {

  selectedProps: IPropertiesList;
  filteredProps: IPropertiesList;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private selectedPropertiesService: SelectedPropertiesService) {
    this.selectedProps = selectedPropertiesService.ValueProperties;
    this.filteredProps = selectedPropertiesService.FilterProperties;
  }


  // Create observer object when the list of properties changes
  onPropertiesListChange = {
    next: (propertiesList => {
      if (propertiesList.length != 0) {
        if (this.selectedPropertiesService.Products) {
          console.log(this.selectedPropertiesService.Products?.length);

          // build the quantityData object to be passed as data source
          const quantityData = this.selectedPropertiesService.Products.map(p => {
            const quantityObject: QuantityObject = {};
            propertiesList.forEach(property => {
              quantityObject[property.name] = p.objectId
            });
            return quantityObject;
          });

          // build an array of string for displayedColumns
          this.displayedColumns = propertiesList.map(p => p.name);

          // initialize the data source
          this.dataSource = new MatTableDataSource(quantityData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator.pageSizeOptions = [5];

          console.log(quantityData);
        }
      }
      else
      {
        this.displayedColumns = null;
        this.dataSource = null;
      }


      console.log(propertiesList.length);
    }),
    error: err => console.log(err),
    complete: () => console.log('Observer got a complete notification'),
  };

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSizeOptions = [5];
    this.selectedProps.propertiesListChange.subscribe(this.onPropertiesListChange);
  }

}
