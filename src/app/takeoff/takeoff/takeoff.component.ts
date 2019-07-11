import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IProject } from 'src/app/shared/models/bimsync.model';
import { ActivatedRoute } from '@angular/router';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-takeoff',
  templateUrl: './takeoff.component.html',
  styleUrls: ['./takeoff.component.scss']
})
export class TakeoffComponent implements OnInit, OnDestroy {

  project: IProject;
  projectId: string;
  revisionIds: string[];

  constructor(
    private route: ActivatedRoute,
    private bimsyncService: BimsyncService,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.revisionIds = ['dc22c89880e9488bba8b780261d362a3'];

    this.bimsyncService.getProject(this.projectId).subscribe(project => this.headerService.setProjectName(project.name));
  }

  ngOnDestroy() {
    this.headerService.setProjectName(null);
  }
}
