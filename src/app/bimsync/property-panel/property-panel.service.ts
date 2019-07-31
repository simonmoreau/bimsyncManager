import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, IProject } from 'src/app/shared/models/bimsync.model';
import { BimsyncService } from '../bimsync.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyPanelService {

  productsIdList = new BehaviorSubject<string[]>([]);

  get productIds(): string[] { return this.productsIdList.value; }

  constructor() { }

  /** Add products to the list of selected products */
  AddProducts(ids: string[]) {
    this.productsIdList.next(ids);
  }
}
