import { Component, OnInit } from '@angular/core';
import { RetreivedElementsService } from '../../services/retreived-elements.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IProject } from '../../models/bimsync.model';
import { ShareProjectDialogComponent } from 'src/app/share-project/share-project-dialog/share-project-dialog.component';

@Component({
  selector: 'app-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent implements OnInit {

  project: IProject;

  constructor(
    private headerService: RetreivedElementsService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.headerService.project.subscribe(project => {
      this.project = project;
    });
  }

  openShareDialog(): void {
    const dialogRef = this.dialog.open(ShareProjectDialogComponent, {
      width: '250px',
      data: this.project
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
