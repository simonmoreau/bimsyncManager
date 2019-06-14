import { Component, OnInit, ViewChild } from "@angular/core";

import {  IProject} from "./bimsync-project.models";
import { IUser } from "../bimsync-oauth/bimsync-oauth.models";

import { BimsyncProjectService } from "app/bimsync-project/bimsync-project.services";
import { AppService } from "app/app.service";

import { ShareModalComponent } from "../share-modal/share-modal.component";
import { ProjectDetailModalComponent } from "../project-detail-modal/project-detail-modal.component";
import { ProjectCreateModalComponent } from "../project-create-modal/project-create-modal.component"

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
  appService: AppService;
  loaded: boolean = false;

  @ViewChild("shareModal", {static: false}) shareModal: ShareModalComponent;
  @ViewChild("projectDetailModal", {static: false}) projectDetailModal: ProjectDetailModalComponent;
  @ViewChild("createModal", {static: false}) createModal: ProjectCreateModalComponent;

  constructor(
    private _appService: AppService,
    private _bimsyncProjectService: BimsyncProjectService
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
  Share(project) {
    this.shareModal.OpenShareModal(project);
  }

  OpenDetails(project) {
    this.projectDetailModal.OpenDetailModal(project);
  }

  OpenCreate(project) {
    this.createModal.OpenCreateModal(project);
  }
}
