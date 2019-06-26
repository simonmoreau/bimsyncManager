import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { first } from 'rxjs/operators';
import { IProject } from 'src/app/shared/models/bimsync.model';

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
    private userService: UserService) { }

  ngOnInit() {

    this.activatedRoute.url.pipe(first()).subscribe(url => {
      if (url[0].path === 'projects') {

      } else {
        let state = '';
        let authorizationCode = '';
        // subscribe to router event and retrive the callback code
        this.activatedRoute.queryParams.subscribe((params: Params) => {
          authorizationCode = params.code;
          state = params.state;
        });

        // Get the connected user
        this.loading = true;
        if (state === 'api') {
          this.userService.Login(authorizationCode)
          .pipe(first())
          .subscribe(
              data => {
                this.router.navigate(['/projects']);
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
        }

        if (state === 'bcf') {
          this.userService.CreateBCFToken(authorizationCode)
          .pipe(first())
          .subscribe(
              data => {
                this.router.navigate(['/projects']);
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
        }
      }

    });



  }

}
