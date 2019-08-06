import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
