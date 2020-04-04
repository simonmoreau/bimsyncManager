import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { IModel, IRevision, ITypeSummary } from 'src/app/shared/models/bimsync.model';
import { MatSelectChange } from '@angular/material/select';
import { SelectedPropertiesService } from '../selected-properties.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-revision-selection',
  templateUrl: './revision-selection.component.html',
  styleUrls: ['./revision-selection.component.scss']
})
export class RevisionSelectionComponent implements OnInit {

  constructor(private bimsyncService: BimsyncService, private selectedPropertiesService: SelectedPropertiesService) { }

  @Input() projectId: string;
  @Output() revisionChange: EventEmitter<IRevision> = new EventEmitter<IRevision>();
  @Output() categoryChange: EventEmitter<ITypeSummary> = new EventEmitter<ITypeSummary>();

  models: IModel[];
  revisions: IRevision[];
  categories: ITypeSummary[];
  selectedModel: IModel;
  selectedRevision: IRevision;
  selectedCategory: ITypeSummary;
  isLoading: boolean;

  sortAlphabetically = (a: ITypeSummary, b: ITypeSummary) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }

  ngOnInit() {

    this.isLoading = true;
    this.bimsyncService.getModels(this.projectId).subscribe(
      m => {
        this.models = m;
        if (m.length !== 0) {
          this.selectedModel = m[0];
          this.bimsyncService.getRevisions(this.projectId, this.selectedModel.id).subscribe(
            r => {
              this.revisions = r;
              if (r.length !== 0) {
                this.selectedRevision = r[0];
                this.revisionChange.emit(this.selectedRevision);
                this.bimsyncService.getProductsTypeSummary(this.projectId, this.selectedRevision.id).subscribe(
                  s => {
                    this.categories = s.sort(this.sortAlphabetically);
                    if (s.length !== 0) {
                      this.selectedCategory = s[0];
                      this.categoryChange.emit(this.selectedCategory as ITypeSummary);
                      this.selectedPropertiesService.ValueProperties.ClearList();
                      this.isLoading = false;
                    }
                  }
                );
              } else {
                this.selectedRevision = null;
                this.categories = null;
                this.selectedCategory = null;
                this.selectedPropertiesService.ValueProperties.ClearList();
                this.isLoading = false;
              }
            }
          );
        }
      }
    );
  }

  onModelChange(event: MatSelectChange) {

    this.isLoading = true;

    this.bimsyncService.getRevisions(this.projectId, (event.value as IModel).id).subscribe(
      r => {
        this.revisions = r;
        if (r.length !== 0) {
          this.selectedRevision = r[0];
          this.revisionChange.emit(this.selectedRevision);
          this.bimsyncService.getProductsTypeSummary(this.projectId, this.selectedRevision.id).subscribe(
            s => {
              this.categories = s.sort(this.sortAlphabetically);
              if (s.length !== 0) {
                this.selectedCategory = s[0];
                this.categoryChange.emit(this.selectedCategory as ITypeSummary);
                this.selectedPropertiesService.ValueProperties.ClearList();
                this.isLoading = false;
              }
            }
          );
        } else {
          this.selectedRevision = null;
          this.categories = null;
          this.selectedCategory = null;
          this.selectedPropertiesService.ValueProperties.ClearList();
          this.isLoading = false;
        }
      }
    );
  }

  onRevisionChange(event: MatSelectChange) {

    this.isLoading = true;

    this.revisionChange.emit(event.value as IRevision);
    this.bimsyncService.getProductsTypeSummary(this.projectId, (event.value as IRevision).id).subscribe(
      s => {
        this.categories = s.sort(this.sortAlphabetically);
        if (s.length !== 0) {
          this.selectedCategory = s[0];
          this.categoryChange.emit(this.selectedCategory as ITypeSummary);
          this.selectedPropertiesService.ValueProperties.ClearList();
          this.isLoading = false;
        }
      }
    );
  }

  onCategoryChange(event: MatSelectChange) {
    this.bimsyncService.listProducts(this.projectId,this.selectedCategory.name,this.selectedRevision.id)
    .subscribe(p=> {
      this.selectedPropertiesService.Products = p;
      const ifcType:ITypeSummary = event.value as ITypeSummary;
      this.categoryChange.emit(ifcType);
      this.selectedPropertiesService.ValueProperties.ClearList();
    });
  }

  private GetModels(projectId: string): Observable<IModel[]> {
    if (projectId) {
      return this.bimsyncService.getModels(projectId);
    } else {
      return of(new Array<IModel>());
    }
  }

  private GetRevisions(projectId: string, model: IModel): Observable<IRevision[]> {
    if (projectId && model) {
      return this.bimsyncService.getRevisions(projectId, model.id);
    } else {
      return of(new Array<IRevision>());
    }
  }

  private GetProductTypeSummary(projectId: string, revision: IRevision): Observable<ITypeSummary[]> {
    if (projectId && revision) {
      return this.bimsyncService.getProductsTypeSummary(projectId, revision.id);
    } else {
      return of(new Array<ITypeSummary>());
    }
  }
}
