import { Component, OnInit, Input } from '@angular/core';
import { IProject, IViewerToken } from 'src/app/shared/models/bimsync.model';
import { ActivatedRoute } from '@angular/router';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-takeoff',
  templateUrl: './takeoff.component.html',
  styleUrls: ['./takeoff.component.scss']
})
export class TakeoffComponent implements OnInit {

  project: IProject;
  viewerToken: IViewerToken;
  viewerLoaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private bimsyncService: BimsyncService
  ) { }

  ngOnInit() {
    this.viewerLoaded = false;
    const projectId = this.route.snapshot.paramMap.get('id');

    this.bimsyncService.getProject(projectId).subscribe({
      next: project => {
        this.project = project;
        this.bimsyncService.getViewer3DTokenForRevision(
          project.id, ['62483fd054ab42c294f6ed0ddb0e49cf']).subscribe(token => {
            this.viewerToken = token;
            this.viewerLoaded = true;
          });
      }
    });
  }
}
