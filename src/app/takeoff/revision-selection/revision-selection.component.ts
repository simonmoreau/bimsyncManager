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

  models$: Observable<IModel[]>;
  revisions$: Observable<IRevision[]>;
  categories$: Observable<ITypeSummary[]>;
  selectedModel: IModel;
  selectedRevision: IRevision;
  selectedCategory: any;

  ngOnInit() {
    this.models$ = this.bimsyncService.getModels(this.projectId);

    this.categories$ = this.models$.pipe(
      mergeMap(models => {
        this.revisions$ = this.bimsyncService.getRevisions(this.projectId, models[0].id);
        return this.revisions$; }),
        mergeMap(revisions => {
          return this.bimsyncService.getProductsTypeSummary(this.projectId, revisions[0].id);
        })
    );
  }

  modelChange(event: MatSelectChange) {
    this.categories$ = this.bimsyncService.getRevisions(this.projectId, (event.value as IModel).id).pipe(
        mergeMap(revisions => {
          return this.bimsyncService.getProductsTypeSummary(this.projectId, revisions[0].id);
        })
    );
  }

  revisionChange(event: MatSelectChange) {
    this.categories$ = this.bimsyncService.getProductsTypeSummary(this.projectId, (event.value as IRevision).id);
  }

  categoryChange(event: MatSelectChange) {
    console.log(event);
  }

}
