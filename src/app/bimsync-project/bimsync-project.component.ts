import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { IProject, IBimsyncBoard, ILibrary, ILibraryItem } from './bimsync-project.models';
import { IUser } from '../bimsync-oauth/bimsync-oauth.models';

import { BimsyncProjectService } from './bimsync-project.services';

import {
  ICreatedProject, ICreatedMember, ICreatedModel,
  ICreatedBoard, ICreatedStatus, ICreatedType, ICreatedFolder
} from 'app/bimsync-project/creator.models';
import { AppService } from 'app/app.service';

import { ShareModalComponent } from '../share-modal/share-modal.component';

@Component({
  selector: 'app-bimsync-project',
  templateUrl: './bimsync-project.component.html',
  styleUrls: ['./bimsync-project.component.scss'],
  providers: [BimsyncProjectService]
})
export class BimsyncProjectComponent implements OnInit {
  errorMessage: string;
  User: IUser;
  IsBCF: boolean;
  projects: IProject[] = [];
  createdProject: IProject;
  open: boolean;
  share: boolean;
  jsonConfig: any;
  submitted: boolean;
  appService: AppService;
  loaded: boolean = false;

  @ViewChild('shareModal') modal: ShareModalComponent;

  constructor(private _bimsyncProjectService: BimsyncProjectService, private _appService: AppService) {
    this.appService = _appService;
  }

  ngOnInit() {
    this.appService.GetUser().subscribe(
      user => {
        this.User = user;
        this.GetProjects();
        this.IsBCF = (this.User.BCFToken === "");
      },
      error => (this.errorMessage = <any>error)
    );
  }

  GetProjects() {
    this._bimsyncProjectService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
        this.loaded = true;
      },
        error => this.errorMessage = <any>error);

    return false;
  }

  onSubmit() {

    // let temp = (<any>this.jsonConfig);
    // let creators = <ICreator[]>temp;

    let creators = JSON.parse(this.jsonConfig);
    console.log(creators);

    let creatorArray: ICreatedProject[] = creators;

    for (let i = 0; i < creatorArray.length; i++) {
      this.CreateProject(creatorArray[i]);
    }
  }

  CreateProject(creator: ICreatedProject) {

    console.log(creator);
    // Create the project
    this._bimsyncProjectService.createNewProject(creator.projectName, creator.projectDescription)
      .subscribe(project => {
        console.log(project.name);

        if (creator.users) {
          // Assign users
          this.AssingUsers(creator.users, project.id);
        }
        if (creator.models) {
          // Create models
          this.CreateModels(creator.models, project.id);
        }

        if (creator.boards) {
          // Create boards
          this.CreateBoards(creator, project.id);
        }

        if (creator.folders) {
          // Create folders
          this.CreateFolders(creator.folders, project.id);
        }
      },
        error => this.errorMessage = <any>error);
  }

  AssingUsers(users: ICreatedMember[], projectId: string) {
      // Assign new users
      Observable.from(users).mergeMap(user => {
        return this._bimsyncProjectService.AddUser(projectId, user.id, user.role)
      })
        .subscribe(member => {
          console.log(member.role);
        },
          error => this.errorMessage = <any>error);
  }

  CreateModels(models: ICreatedModel[], projectId: string) {
      // Create new models
      Observable.from(models).mergeMap(model => {
        return this._bimsyncProjectService.AddModel(projectId, model.name)
        })
          .subscribe(m => {
            console.log(m.name);
          },
            error => this.errorMessage = <any>error);
  }


  CreateFolders(folders: ICreatedFolder[], projectId: string) {

    this.GetDocumentLibrary(projectId)
      .flatMap(library => {
        let parentId = null;
        return Observable.from(folders).mergeMap(subfolder => {
          return this.CreateAFolder(subfolder, projectId, parentId, library);
        })
      })
      .subscribe(m => {
        console.log(m.name);
      },
        error => this.errorMessage = <any>error);
  }

  CreateAFolder(folder: ICreatedFolder, projectId: string, parentId: string, library: ILibrary): Observable<ILibraryItem> {
    return this._bimsyncProjectService.AddFolder(projectId, folder.name, parentId, library.id)
      .flatMap(createdFolder => {
        if (folder.folders) {
          return Observable.from(folder.folders).mergeMap(subfolder => {
            return this.CreateAFolder(subfolder, projectId, createdFolder.id, library);
          });
        } else {
          return new Observable<ILibraryItem>((observer) => {
            // observable execution
            observer.next(createdFolder)
            observer.complete()
          })
        }
      });
  }

  GetDocumentLibrary(projectId: string): Observable<ILibrary> {
    // Get the Document library id
    return this._bimsyncProjectService.getLibraries(projectId)
      .map(libraries => {
        let documentLibrary = libraries.filter(library => library.name === "Documents");
        return (documentLibrary.length > 0) ? documentLibrary[0] : null;
      })
  }

  CreateBoards(creator: ICreatedProject, projectId: string) {

    let boards: ICreatedBoard[] = creator.boards;

    for (let board of boards) {
      // Create a new board
      this._bimsyncProjectService.AddBoard(projectId, board.name)
        .subscribe(bimsyncBoard => {
          console.log(bimsyncBoard.name);

          // Create extention statuses
          if (board.statuses) {
            this.CreateExtensionStatuses(bimsyncBoard, board);
          }

          // Create extension types
          if (board.types) {
            this.CreateExtensionTypes(bimsyncBoard, board);
          }

        },
          error => this.errorMessage = <any>error);
    }
  }

  CreateExtensionStatuses(bimsyncBoard: IBimsyncBoard, board: ICreatedBoard) {
    let statuses: ICreatedStatus[] = board.statuses;
    let existingStatusesNames: string[] = ["Closed", "Open"];

    for (let status of statuses) {

      let index = existingStatusesNames.indexOf(status.name);

      if (index > -1) {
        // If the status exist, update it
        this._bimsyncProjectService.UpdateExtensionStatus(bimsyncBoard.project_id, status.name, status.name, status.color, status.type)
          .subscribe(bimsyncStatus => {
            console.log(bimsyncStatus);
          },
            error => this.errorMessage = <any>error);
        // Remove it from the existingTypesNames
        existingStatusesNames.splice(index, 1);
      } else {
        // If not, Create it
        this._bimsyncProjectService.AddExtensionStatus(bimsyncBoard.project_id, status.name, status.color, status.type)
          .subscribe(bimsyncStatus => {
            console.log(bimsyncStatus);
          },
            error => this.errorMessage = <any>error);
      }
    }

    setTimeout(console.log('wait'), 500);

    // Detele remaining existing statuses
    for (let name of existingStatusesNames) {
      // Delete a status
      this._bimsyncProjectService.DeleteExtensionStatus(bimsyncBoard.project_id, name)
        .subscribe(bimsyncStatus => {
          console.log(bimsyncStatus);
        },
          error => this.errorMessage = <any>error);
    }
  }

  CreateExtensionTypes(bimsyncBoard: IBimsyncBoard, board: ICreatedBoard) {
    let types: ICreatedType[] = board.types;
    let existingTypesNames: string[] = ["Error", "Warning", "Info", "Unknown"];

    for (let type of types) {

      let index = existingTypesNames.indexOf(type.name);

      if (index > -1) {
        // If the type exist, update it
        this._bimsyncProjectService.UpdateExtensionType(bimsyncBoard.project_id, type.name, type.name, type.color)
          .subscribe(bimsyncType => {
            console.log(bimsyncType);
          },
            error => this.errorMessage = <any>error);
        // Remove it from the existingTypesNames
        existingTypesNames.splice(index, 1);
      } else {
        // If not, Create it
        this._bimsyncProjectService.AddExtensionType(bimsyncBoard.project_id, type.name, type.color)
          .subscribe(bimsyncType => {
            console.log(bimsyncType);
          },
            error => this.errorMessage = <any>error);
      }
    }

    setTimeout(console.log('wait'), 500);

    // Detele remaining existing types
    for (let name of existingTypesNames) {
      // Delete a status
      this._bimsyncProjectService.DeleteExtensionType(bimsyncBoard.project_id, name)
        .subscribe(bimsyncType => {
          console.log(bimsyncType);
        },
          error => this.errorMessage = <any>error);
    }
  }

  Share(project) {
    this.modal.OpenShareModal(project);
  }
}
