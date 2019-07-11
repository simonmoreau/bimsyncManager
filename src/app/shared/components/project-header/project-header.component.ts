import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent implements OnInit {

  projectName: string;

  constructor(private headerService: HeaderService ) { }

  ngOnInit() {
    this.headerService.projectName.subscribe(projectName => {
      this.projectName = projectName;
    });
  }
}
