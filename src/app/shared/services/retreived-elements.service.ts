import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProject, IRevision, Product } from '../models/bimsync.model';

@Injectable({
  providedIn: 'root'
})
export class RetreivedElementsService {

  project = new BehaviorSubject<IProject>(null);
  revision = new BehaviorSubject<IRevision>(null);
  ifcClass = new BehaviorSubject<string>(null);
  products = new BehaviorSubject<Product[]>(null);

  constructor() { }

  setProject(project: IProject) {
    this.project.next(project);
  }

  setRevision(revision: IRevision) {
    this.revision.next(revision);
  }

  setIfcClass(ifcClass: string) {
    this.ifcClass.next(ifcClass);
  }

  setProducts(products: Product[]) {
    this.products.next(products);
  }
}


