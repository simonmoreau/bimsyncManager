import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IProject, IRevision, ITypeSummary, Product } from 'src/app/shared/models/bimsync.model';
import { ActivatedRoute } from '@angular/router';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { PropertyTreeService } from '../property-tree/property-tree.service';
import { SelectedPropertiesService } from '../selected-properties.service';
import { IPropertiesList } from '../selected-properties.model';

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
  selectedElements: Product[];
  selectedProps: IPropertiesList;
  filteredProps: IPropertiesList;

  constructor(
    private route: ActivatedRoute,
    private bimsyncService: BimsyncService,
    private headerService: HeaderService,
    private propertyTreeService: PropertyTreeService,
    private selectedPropertiesService: SelectedPropertiesService
  ) {
    this.selectedProps = selectedPropertiesService.selectedProperties;
    this.filteredProps = selectedPropertiesService.filteredProperties;
  }

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
