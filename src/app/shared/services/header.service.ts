import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProject } from '../models/bimsync.model';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  project = new BehaviorSubject(null);

  constructor() { }

  setProject(project: IProject) {
    this.project.next(project);
  }
}


