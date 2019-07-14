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
  selectedCategory: ITypeSummary;

  ngOnInit() {
    this.models$ = this.bimsyncService.getModels(this.projectId);

    this.categories$ = this.models$.pipe(
      tap(models => this.selectedModel = models[0]),
      mergeMap(models => {
        this.revisions$ = this.bimsyncService.getRevisions(this.projectId, this.selectedModel.id);
        return this.revisions$;
      }),
      tap(revisions => this.selectedRevision = revisions[0]),
      mergeMap(revisions => {
        return this.bimsyncService.getProductsTypeSummary(this.projectId, this.selectedRevision.id);
      }),
      tap(summary => this.selectedCategory = summary[0])
    );
  }

  modelChange(event: MatSelectChange) {
    this.revisions$ = this.bimsyncService.getRevisions(this.projectId, (event.value as IModel).id);

    this.categories$ = this.revisions$.pipe(
      tap(revisions => this.selectedRevision = revisions[0]),
      mergeMap(revisions => {
        this.selectedRevision = revisions[0];
        return this.bimsyncService.getProductsTypeSummary(this.projectId, revisions[0].id);
      }),
      tap(summary => this.selectedCategory = summary[0])
    );
  }

  revisionChange(event: MatSelectChange) {
    this.categories$ = this.bimsyncService.getProductsTypeSummary(this.projectId, (event.value as IRevision).id).pipe(
      tap(summary => this.selectedCategory = summary[0])
    );
  }

  categoryChange(event: MatSelectChange) {
    console.log(event);
  }

}
