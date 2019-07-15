import { Component, OnInit, Input } from '@angular/core';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { Observable } from 'rxjs';
import { IModel, IRevision, ITypeSummary } from 'src/app/shared/models/bimsync.model';
import { mergeMap, tap } from 'rxjs/operators';
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

  ngOnInit() {

    this.bimsyncService.getModels(this.projectId).subscribe(
      m => {
        this.models = m;
        if (m.length !== 0 ) {
          this.selectedModel = m[0];
          this.bimsyncService.getRevisions(this.projectId, this.selectedModel.id).subscribe(
            r => {
              this.revisions = r;
              if (r.length !== 0) {
                this.selectedRevision = r[0];
                this.bimsyncService.getProductsTypeSummary(this.projectId, this.selectedRevision.id).subscribe(
                  s => {
                    this.categories = s;
                    if (s.length !== 0) { this.selectedCategory = s[0]; }
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

  modelChange(event: MatSelectChange) {
    // (event.value as IModel).id

    this.bimsyncService.getRevisions(this.projectId, (event.value as IModel).id).subscribe(
      r => {
        this.revisions = r;
        if (r.length !== 0) {
          this.selectedRevision = r[0];
          this.bimsyncService.getProductsTypeSummary(this.projectId, this.selectedRevision.id).subscribe(
            s => {
              this.categories = s;
              if (s.length !== 0) { this.selectedCategory = s[0]; }
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

  revisionChange(event: MatSelectChange) {
    this.bimsyncService.getProductsTypeSummary(this.projectId, (event.value as IRevision).id).subscribe(
      s => {
        this.categories = s;
        if (s.length !== 0) { this.selectedCategory = s[0]; }
      }
    );
  }

  categoryChange(event: MatSelectChange) {
    console.log(event);
  }

}
