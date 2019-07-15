import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { IModel, IRevision, ITypeSummary } from 'src/app/shared/models/bimsync.model';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-revision-selection',
  templateUrl: './revision-selection.component.html',
  styleUrls: ['./revision-selection.component.scss']
})
export class RevisionSelectionComponent implements OnInit {

  constructor(private bimsyncService: BimsyncService) { }

  @Input() projectId: string;

  models: IModel[];
  revisions: IRevision[];
  categories: ITypeSummary[];
  selectedModel: IModel;
  selectedRevision: IRevision;
  selectedCategory: ITypeSummary;

  @Output() revisionChange: EventEmitter<IRevision> = new EventEmitter<IRevision>();
  @Output() categoryChange: EventEmitter<ITypeSummary> = new EventEmitter<ITypeSummary>();

  ngOnInit() {

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
                    this.categories = s;
                    if (s.length !== 0) {
                      this.selectedCategory = s[0];
                      this.categoryChange.emit(this.selectedCategory as ITypeSummary);
                    }
                  }
                );
              } else {
                this.selectedRevision = null;
                this.categories = null;
                this.selectedCategory = null;
              }
            }
          );
        }
      }
    );
  }

  onModelChange(event: MatSelectChange) {
    // (event.value as IModel).id

    this.bimsyncService.getRevisions(this.projectId, (event.value as IModel).id).subscribe(
      r => {
        this.revisions = r;
        if (r.length !== 0) {
          this.selectedRevision = r[0];
          this.revisionChange.emit(this.selectedRevision);
          this.bimsyncService.getProductsTypeSummary(this.projectId, this.selectedRevision.id).subscribe(
            s => {
              this.categories = s;
              if (s.length !== 0) {
                this.selectedCategory = s[0];
                this.categoryChange.emit(this.selectedCategory as ITypeSummary);
              }
            }
          );
        } else {
          this.selectedRevision = null;
          this.categories = null;
          this.selectedCategory = null;
        }
      }
    );
  }

  onRevisionChange(event: MatSelectChange) {

    this.revisionChange.emit(event.value as IRevision);
    this.bimsyncService.getProductsTypeSummary(this.projectId, (event.value as IRevision).id).subscribe(
      s => {
        this.categories = s;
        if (s.length !== 0) {
          this.selectedCategory = s[0];
          this.categoryChange.emit(this.selectedCategory as ITypeSummary);
        }
      }
    );
  }

  onCategoryChange(event: MatSelectChange) {
    console.log(event);
    this.categoryChange.emit(event.value as ITypeSummary);
  }

}
