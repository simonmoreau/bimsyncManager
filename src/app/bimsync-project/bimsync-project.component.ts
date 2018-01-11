import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { IProject, IBimsyncBoard } from './bimsync-project.models';
import { IUser } from '../bimsync-oauth/bimsync-oauth.models';
import { bimsyncProjectService } from './bimsync-project.services';
import { ICreator, IMember, IModel, IBoard, IStatus, IType } from 'app/bimsync-project/creator.models';
import { AppService } from 'app/app.service';
import * as data from './bimsyncProject.json';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-bimsync-project',
  templateUrl: './bimsync-project.component.html',
  styleUrls: ['./bimsync-project.component.scss'],
  providers: [bimsyncProjectService]
})
export class BimsyncProjectComponent implements OnInit {
  errorMessage: string;
  User: IUser;
  IsBCF: boolean;
  projects: IProject[] = [];
  createdProject: IProject;
  open: boolean;
  jsonConfig: any;
  submitted: boolean;
  _appService: AppService;

  constructor(private _bimsyncProjectService: bimsyncProjectService, private appService: AppService) {
    this._appService = appService;
  }

  ngOnInit() {
    this.GetProjects();
    this.User = this._appService.GetUser();
    this.IsBCF = (this.User.bcfToken == "");
  }

  GetProjects() {
    this._bimsyncProjectService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
      },
      error => this.errorMessage = <any>error);

    return false;
  }

  onSubmit() {

    //let temp = (<any>this.jsonConfig);
    //let creators = <ICreator[]>temp;

    let creators = JSON.parse(this.jsonConfig);
    console.log(creators);

    let creatorArray: ICreator[] = creators;

    for (let i = 0; i < creatorArray.length; i++) {
      this.CreateProject(creatorArray[i]);
    }
  }

  CreateProject(creator: ICreator) {

    console.log(creator);
    //Create the project
    this._bimsyncProjectService.createNewProject(creator.projectName, creator.projectDescription)
      .subscribe(project => {
        console.log(project.name);

        if (creator.users) {
          //Assign users
          this.AssingUsers(creator.users, project.id);
        }
        if (creator.models) {
          //Create models
          this.CreateModels(creator.models, project.id);
        }

        if (creator.boards) {
          //Create boards
          this.CreateBoards(creator, project.id);
        }
      },
      error => this.errorMessage = <any>error);
  }

  AssingUsers(users: IMember[], projectId: string) {
    for (let user of users) {
      //Assign a new user
      this._bimsyncProjectService.AddUser(projectId, user.id, user.role)
        .subscribe(member => {
          console.log(member.role);
        },
        error => this.errorMessage = <any>error);
    }
  }

  CreateModels(models: IModel[], projectId: string) {
    for (let model of models) {
      //Create a new model
      this._bimsyncProjectService.AddModel(projectId, model.name)
        .subscribe(model => {
          console.log(model.name);
        },
        error => this.errorMessage = <any>error);
    }
  }

  CreateBoards(creator: ICreator, projectId: string) {

    let boards: IBoard[] = creator.boards;

    for (let board of boards) {
      //Create a new board
      this._bimsyncProjectService.AddBoard(projectId, board.name)
        .subscribe(bimsyncBoard => {
          console.log(bimsyncBoard.name);

          //Create extention statuses
          if (board.statuses) {
            this.CreateExtensionStatuses(bimsyncBoard, board);
          }

          //Create extension types
          if (board.types) {
            this.CreateExtensionTypes(bimsyncBoard, board);
          }

        },
        error => this.errorMessage = <any>error);
    }
  }

  CreateExtensionStatuses(bimsyncBoard: IBimsyncBoard, board: IBoard) {
    let statuses: IStatus[] = board.statuses;
    let existingStatusesNames: string[] = ["Closed", "Open"];

    for (let status of statuses) {

        let index = existingStatusesNames.indexOf(status.name);

        if (index > -1) {
          //If the status exist, update it
          this._bimsyncProjectService.UpdateExtensionStatus(bimsyncBoard.project_id, status.name,status.name, status.color, status.type)
          .subscribe(bimsyncStatus => {
            console.log(bimsyncStatus);
          },
          error => this.errorMessage = <any>error);
          //Remove it from the existingTypesNames
          existingStatusesNames.splice(index, 1);
        }
        else {
          //If not, Create it
          this._bimsyncProjectService.AddExtensionStatus(bimsyncBoard.project_id, status.name, status.color,status.type)
            .subscribe(bimsyncStatus => {
              console.log(bimsyncStatus);
            },
            error => this.errorMessage = <any>error);
        }
    }

    setTimeout(console.log('wait'), 500);

    //Detele remaining existing statuses
    for (let name of existingStatusesNames) {
      //Delete a status
      this._bimsyncProjectService.DeleteExtensionStatus(bimsyncBoard.project_id, name)
        .subscribe(bimsyncStatus => {
          console.log(bimsyncStatus);
        },
        error => this.errorMessage = <any>error);
    }
  }

  CreateExtensionTypes(bimsyncBoard: IBimsyncBoard, board: IBoard) {
    let types: IType[] = board.types;
    let existingTypesNames: string[] = ["Error", "Warning", "Info", "Unknown"];

    for (let type of types) {

      let index = existingTypesNames.indexOf(type.name);

      if (index > -1) {
        //If the type exist, update it
        this._bimsyncProjectService.UpdateExtensionType(bimsyncBoard.project_id, type.name,type.name, type.color)
        .subscribe(bimsyncType => {
          console.log(bimsyncType);
        },
        error => this.errorMessage = <any>error);
        //Remove it from the existingTypesNames
        existingTypesNames.splice(index, 1);
      }
      else {
        //If not, Create it
        this._bimsyncProjectService.AddExtensionType(bimsyncBoard.project_id, type.name, type.color)
          .subscribe(bimsyncType => {
            console.log(bimsyncType);
          },
          error => this.errorMessage = <any>error);
      }
    }

    setTimeout(console.log('wait'), 500);

    //Detele remaining existing types
    for (let name of existingTypesNames) {
      //Delete a status
      this._bimsyncProjectService.DeleteExtensionType(bimsyncBoard.project_id, name)
        .subscribe(bimsyncType => {
          console.log(bimsyncType);
        },
        error => this.errorMessage = <any>error);
    }
  }

}