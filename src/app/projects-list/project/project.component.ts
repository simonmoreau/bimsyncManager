import { Component, OnInit, Input } from '@angular/core';
import { IProject } from 'src/app/shared/models/bimsync.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @Input() project: IProject;

  constructor() { }

  ngOnInit() {
  }

  open(event: Event) {
    event.preventDefault();
    // EDIT: Looks like you also have to include Event#stopImmediatePropogation as well
    event.stopImmediatePropagation();
    // ...
    alert('test');
  }

  remove(event: Event) {
    event.preventDefault();
    // EDIT: Looks like you also have to include Event#stopImmediatePropogation as well
    event.stopImmediatePropagation();
    // ...
    alert('remove');
  }

}
