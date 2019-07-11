import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  projectName = new BehaviorSubject(null);

  constructor() { }

  setProjectName(title: string) {
    this.projectName.next(title);
  }
}


