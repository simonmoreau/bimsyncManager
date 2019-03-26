import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { from } from "rxjs/observable/from";
import { mergeMap } from "rxjs/operators";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";

import {
  IProject,
  IBimsyncBoard, IExtensionStatus, IExtensionType,
  ILibrary,
  ILibraryItem
} from "./bimsync-project.models";
import { IUser } from "../bimsync-oauth/bimsync-oauth.models";

import { BimsyncProjectService } from "./bimsync-project.services";

import {
  ICreatedProject,
  ICreatedMember,
  ICreatedModel,
  ICreatedBoard,
  ICreatedStatus,
  ICreatedType,
  ICreatedFolder
} from "app/bimsync-project/creator.models";
import { AppService } from "app/app.service";

import { ShareModalComponent } from "../share-modal/share-modal.component";

@Component({
  selector: "app-bimsync-project",
  templateUrl: "./bimsync-project.component.html",
  styleUrls: ["./bimsync-project.component.scss"],
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
  submitted: boolean = false;
  appService: AppService;
  loaded: boolean = false;

  @ViewChild("shareModal") modal: ShareModalComponent;

  constructor(
    private _bimsyncProjectService: BimsyncProjectService,
    private _appService: AppService
  ) {
    this.appService = _appService;
  }

  ngOnInit() {
    this.appService.GetUser().subscribe(
      user => {
        this.User = user;
        this.GetProjects();
        this.IsBCF = this.User.BCFToken === "";
      },
      error => (this.errorMessage = <any>error)
    );
  }

  GetProjects() {
    this._bimsyncProjectService.getProjects().subscribe(
      projects => {
        this.projects = projects;
        this.loaded = true;
      },
      error => (this.errorMessage = <any>error)
    );

    return false;
  }

  onSubmit() {
    // let temp = (<any>this.jsonConfig);
    // let creators = <ICreator[]>temp;
    this.submitted = true;

    let creators = JSON.parse(this.jsonConfig);
    console.log(creators);

    let creatorArray: ICreatedProject[] = creators;

    Observable.from(creatorArray)
      .mergeMap(creator => {
        return this.CreateProject(creator);
      }).subscribe(result => {
        console.log(result);
      },
        error => this.errorMessage = <any>error,
        () => {
          console.log("complete")
          this.open = false;
      }
      );
  }

  CreateProject(creator: ICreatedProject): Observable<any> {

    // Create the project
    return this._bimsyncProjectService
      .createNewProject(creator.projectName, creator.projectDescription)
      .flatMap(
        project => {

          let observable$: Observable<any> = new Observable<ILibraryItem>(observer => {
            // observable execution
            observer.next(null);
            observer.complete();
          });

          if (creator.users) {
            // Assign users
            observable$ = observable$.merge(this.AssingUsers(creator.users, project.id));
          }
          if (creator.models) {
            // Create models
            observable$ = observable$.merge(this.CreateModels(creator.models, project.id));
          }

          if (creator.boards) {
            // Create boards
            observable$ = observable$.merge(this.CreateBoards(creator, project.id));
          }

          if (creator.folders) {
            // Create folders
            observable$ = observable$.merge(this.CreateFolders(creator.folders, project.id));
          }

          return observable$;
        });
  }

  AssingUsers(users: ICreatedMember[], projectId: string): Observable<any> {
    // Assign new users
    return Observable.from(users)
      .mergeMap(user => {
        return this._bimsyncProjectService.AddUser(
          projectId,
          user.id,
          user.role
        );
      });
  }

  CreateModels(models: ICreatedModel[], projectId: string): Observable<any> {
    // Create new models
    return Observable.from(models)
      .mergeMap(model => {
        return this._bimsyncProjectService.AddModel(
          projectId,
          model.name
        );
      });
  }

  CreateFolders(folders: ICreatedFolder[], projectId: string): Observable<any> {
    return this.GetDocumentLibrary(projectId)
      .flatMap(library => {
        let parentId = null;
        return Observable.from(folders).mergeMap(subfolder => {
          return this.CreateAFolder(
            subfolder,
            projectId,
            parentId,
            library
          );
        });
      });
  }

  CreateAFolder(
    folder: ICreatedFolder,
    projectId: string,
    parentId: string,
    library: ILibrary
  ): Observable<ILibraryItem> {
    return this._bimsyncProjectService
      .AddFolder(projectId, folder.name, parentId, library.id)
      .flatMap(createdFolder => {
        if (folder.folders) {
          return Observable.from(folder.folders).mergeMap(
            subfolder => {
              return this.CreateAFolder(
                subfolder,
                projectId,
                createdFolder.id,
                library
              );
            }
          );
        } else {
          return new Observable<ILibraryItem>(observer => {
            // observable execution
            observer.next(createdFolder);
            observer.complete();
          });
        }
      });
  }

  GetDocumentLibrary(projectId: string): Observable<ILibrary> {
    // Get the Document library id
    return this._bimsyncProjectService
      .getLibraries(projectId)
      .map(libraries => {
        let documentLibrary = libraries.filter(
          library => library.name === "Documents"
        );
        return documentLibrary.length > 0 ? documentLibrary[0] : null;
      });
  }

  CreateBoards(creator: ICreatedProject, projectId: string): Observable<any> {
    // Create new boards
    return Observable.from(creator.boards)
      .mergeMap(board => {
        return this.CreateABoard(creator, projectId, board)
      });
  }

  CreateABoard(creator: ICreatedProject, projectId: string, board: ICreatedBoard): Observable<any> {
    // Create a new board
    return this._bimsyncProjectService
      .AddBoard(projectId, board.name)
      .flatMap(createdboard => {

        let statues$: Observable<IExtensionStatus> = null;
        let types$: Observable<IExtensionType> = null;

        // Create extention statuses
        if (board.statuses) {
          statues$ = this.CreateExtensionStatuses(
            createdboard,
            board
          );
        }

        // Create extension types
        if (board.types) {
          types$ = this.CreateExtensionTypes(
            createdboard,
            board
          );
        }

        if (statues$ != null && types$ != null) {
          return statues$.concat(types$)
        } else if (statues$ != null) {
          return statues$
        } else if (types$ != null) {
          return types$
        } else {
          return null
        }

      })
  }

  CreateExtensionStatuses(
    bimsyncBoard: IBimsyncBoard,
    board: ICreatedBoard
  ): Observable<IExtensionStatus> {
    let existingStatusesNames: string[] = ["Closed", "Open"];

    let createdStatuses: ICreatedStatus[] = [];
    let updatedStatues: ICreatedStatus[] = [];

    for (let status of board.statuses) {
      let index = existingStatusesNames.indexOf(status.name);

      if (index > -1) {
        // The status already exist, we will have to update it
        updatedStatues.push(status);
        // Remove it from the existingTypesNames
        existingStatusesNames.splice(index, 1);
      } else {
        // The status does not exist, we will have to create it
        createdStatuses.push(status);
      }
    }

    // Update statuses
    let updatedStatues$: Observable<any> = Observable.from(
      updatedStatues
    ).flatMap(status => {
      return this._bimsyncProjectService.UpdateExtensionStatus(
        bimsyncBoard.project_id,
        status.name,
        status.name,
        status.color,
        status.type
      );
    });

    // Create statues
    let createdStatues$: Observable<any> = Observable.from(
      createdStatuses
    ).flatMap(status => {
      return this._bimsyncProjectService.AddExtensionStatus(
        bimsyncBoard.project_id,
        status.name,
        status.color,
        status.type
      );
    });

    // Detele remaining existing statuses
    let deleteStatues$: Observable<any> = Observable.from(
      existingStatusesNames
    ).flatMap(name => {
      return this._bimsyncProjectService.DeleteExtensionStatus(
        bimsyncBoard.project_id,
        name
      );
    });

    return createdStatues$.concat(updatedStatues$).concat(deleteStatues$);

  }

  CreateExtensionTypes(
    bimsyncBoard: IBimsyncBoard,
    board: ICreatedBoard
  ): Observable<IExtensionType> {
    let existingTypesNames: string[] = [
      "Error",
      "Warning",
      "Info",
      "Unknown"
    ];

    let createdTypes: ICreatedType[] = [];
    let updatedTypes: ICreatedType[] = [];

    for (let type of board.types) {
      let index = existingTypesNames.indexOf(type.name);

      if (index > -1) {
        // The type already exist, we will have to update it
        updatedTypes.push(type);
        // Remove it from the existingTypesNames
        existingTypesNames.splice(index, 1);
      } else {
        // The type does not exist, we will have to create it
        createdTypes.push(type);
      }
    }

    // Update types
    let updatedTypes$: Observable<any> = Observable.from(
      updatedTypes
    ).flatMap(type => {
      return this._bimsyncProjectService.UpdateExtensionType(
        bimsyncBoard.project_id,
        type.name,
        type.name,
        type.color
      );
    });

    // Create types
    let createdTypes$: Observable<any> = Observable.from(
      createdTypes
    ).flatMap(type => {
      return this._bimsyncProjectService.AddExtensionType(
        bimsyncBoard.project_id,
        type.name,
        type.color
      );
    });

    // Detele remaining existing types
    let deleteTypes$: Observable<any> = Observable.from(
      existingTypesNames
    ).flatMap(name => {
      return this._bimsyncProjectService.DeleteExtensionType(
        bimsyncBoard.project_id,
        name
      );
    });

    return updatedTypes$.concat(createdTypes$).concat(deleteTypes$);
  }

  Share(project) {
    this.modal.OpenShareModal(project);
  }
}
