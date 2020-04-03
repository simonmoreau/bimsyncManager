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
  starred: IProject[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private bimsyncService: BimsyncService) { }

  ngOnInit() {

    this.loading = true;
    this.activatedRoute.url.pipe(first()).subscribe(
      url => {
        if (url[0].path !== 'projects') {
          this.ProcessCallback(this.activatedRoute).subscribe({
            next: user => this.router.navigate(['/projects'])
          });
        } else {
          this.bimsyncService.getProjects().subscribe({
            next: p => {
              this.projects = p;
            },
            error: null,
            complete: () => this.loading = false
          });
          this.bimsyncService.getStarredProjects().subscribe({
            next:p => {
              this.starred = p;
            },
            error: null,
            complete: null,
          })
        }
      }
    );

  }

  ProcessCallback(activatedRoute: ActivatedRoute): Observable<IUser> {

    let state = '';
    let authorizationCode = '';
    // subscribe to router event and retrive the callback code
    activatedRoute.queryParams.subscribe((params: Params) => {
      authorizationCode = params.code;
      state = params.state;
    });

    // Get the connected user
    if (state === 'api') {
      return this.userService.Login(authorizationCode);
    }

    if (state === 'bcf') {
      return this.userService.CreateBCFToken(authorizationCode);
    }
  }
}
