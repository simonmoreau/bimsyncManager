import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { IProject } from './bimsync-project.models';
import { IUser } from '../bimsync-oauth/bimsync-oauth.models';
import { bimsyncProjectService } from './bimsync-project.services';
import { ICreator, IMember, IModel, IBoard } from 'app/bimsync-project/creator.models';
import { AppService } from 'app/app.service';
import * as data from './bimsyncProject.json';

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
  open:boolean;
  jsonConfig:any;
  submitted:boolean;

  constructor(private _bimsyncProjectService: bimsyncProjectService, private appService: AppService) {
  }

  ngOnInit() {
    this.GetProjects();
    this.User = this.appService.GetUser();
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

    const temp = (<any>data);
    let creators = <ICreator[]>temp;
    console.log(creators);

    this.ParseCreator(creators);
  }

  ParseCreator(creators: ICreator[]) {

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
          this.CreateBoards(creator.boards, project.id);
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

  CreateBoards(boards: IBoard[], projectId: string) {
    for (let board of boards) {
      //Create a new board
      this._bimsyncProjectService.AddBoard(projectId, board.name)
        .subscribe(board => {
          console.log(board.name);
        },
        error => this.errorMessage = <any>error);
    }
  }
}