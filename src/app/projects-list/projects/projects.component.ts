import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { first } from 'rxjs/operators';
import { IProject } from 'src/app/shared/models/bimsync.model';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  loading = false;
  error = '';
  projects: IProject[];
  favorites: IProject[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private bimsyncService: BimsyncService) { }

  ngOnInit() {

    this.createUser();

    this.bimsyncService.getProjects().subscribe(
      p => this.projects = p
    );
  }

  createUser() {
    this.activatedRoute.url.pipe(first()).subscribe(
      url => {
        if (url[0].path !== 'projects') {
          this.userService.CreateUser(this.activatedRoute);
        }
      }
    );
  }
}
