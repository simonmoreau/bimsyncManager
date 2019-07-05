import { Component, OnInit, Input } from '@angular/core';
import { IProject } from 'src/app/shared/models/bimsync.model';
import { ActivatedRoute } from '@angular/router';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-takeoff',
  templateUrl: './takeoff.component.html',
  styleUrls: ['./takeoff.component.scss']
})
export class TakeoffComponent implements OnInit {

  private project$: Observable<IProject>;

  constructor(
    private route: ActivatedRoute,
    private bimsyncService: BimsyncService
  ) { }

  ngOnInit() {
        const projectId = this.route.snapshot.paramMap.get('id');
        this.project$ = this.bimsyncService.getProject(projectId);
  }
}
