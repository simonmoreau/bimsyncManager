import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IProject, IRevision, ITypeSummary } from 'src/app/shared/models/bimsync.model';
import { ActivatedRoute } from '@angular/router';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { PropertyTreeService } from '../property-tree/property-tree.service';

@Component({
  selector: 'app-takeoff',
  templateUrl: './takeoff.component.html',
  styleUrls: ['./takeoff.component.scss']
})
export class TakeoffComponent implements OnInit, OnDestroy {

  project: IProject;
  projectId: string;
  revisionIds: string[];
  highlightedElements: string[];

  constructor(
    private route: ActivatedRoute,
    private bimsyncService: BimsyncService,
    private headerService: HeaderService,
    private propertyTreeService: PropertyTreeService
  ) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.revisionIds = null;

    this.bimsyncService.getProject(this.projectId).subscribe(project => this.headerService.setProject(project));
    this.propertyTreeService.UpdateProjectId(this.projectId);
  }

  ngOnDestroy() {
    this.headerService.setProject(null);
  }

  revisionChange(revision: IRevision) {
    // alert(revision.version);
    this.revisionIds = [revision.id];
    this.propertyTreeService.UpdateRevisionId(revision.id);
  }

  categoryChange(category: ITypeSummary) {
    this.propertyTreeService.UpdateIfcType(category.name);
  }
}
