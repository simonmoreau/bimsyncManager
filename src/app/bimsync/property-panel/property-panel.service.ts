import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, IProject } from 'src/app/shared/models/bimsync.model';
import { BimsyncService } from '../bimsync.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyPanelService {

  productsList = new BehaviorSubject<Product[]>([]);

  get products(): Product[] { return this.productsList.value; }

  constructor(private bimsyncService: BimsyncService, private headerService: HeaderService) { }

  /** Add products to the list of selected products */
  AddProducts(ids: string[]) {
    if (ids) {
      const projectId: string = (this.headerService.project.value as IProject).id;
      this.bimsyncService.queryProductsById(projectId, ids).subscribe(products => {
        this.productsList.next(products);
      });
    } else {
      this.productsList.next(null);
    }
  }
}
