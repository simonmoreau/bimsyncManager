import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUser } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: IUser;
  user$: Observable<IUser>;
  clientId: string;
  callbackUrl: string;
  avatarUrl: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private bimsyncService: BimsyncService) {

  }

  ngOnInit() {

    this.clientId = this.userService.clientId;
    this.callbackUrl = this.userService.url + '/callback';
    this.user$ = this.userService.currentUser;

    this.user$.subscribe(
      {
        next: user => {
          this.user = user;
          this.bimsyncService.getCurrentUser().subscribe(
            {
              next: bimsyncUser => {
                this.avatarUrl = bimsyncUser.avatarUrl;
              },
              error: error => this.logout(),
              complete: () => console.log('completed')
            }
          );
        },
        error: error => console.log(error),
        complete: () => {

        }
      }
    );
  }

  logout() {
    this.userService.Logout();
    this.router.navigate(['/home']);
  }
}

