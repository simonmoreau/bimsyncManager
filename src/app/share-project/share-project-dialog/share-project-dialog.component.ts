import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IProject } from 'src/app/shared/models/bimsync.model';

@Component({
  selector: 'app-share-project-dialog',
  templateUrl: './share-project-dialog.component.html',
  styleUrls: ['./share-project-dialog.component.scss']
})
export class ShareProjectDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ShareProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: IProject) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
