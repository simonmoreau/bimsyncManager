import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUser } from '../../shared/models/user.model';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BimsyncService } from 'src/app/bimsync/bimsync.service';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: IUser;
  clientId: string;
  callbackUrl: string;
  avatarUrl$: Observable<string>;

  constructor(
    private router: Router,
    private userService: UserService,
    private bimsyncService: BimsyncService) {
      this.userService.currentUser.subscribe(u => this.user = u);
  }

  ngOnInit() {

    this.clientId = this.userService.clientId;
    this.callbackUrl = this.userService.url + '/callback';

    this.avatarUrl$ = this.bimsyncService.getCurrentUser().pipe(
      map(bimsyncUser => bimsyncUser.avatarUrl ? bimsyncUser.avatarUrl : '../../../../assets/logos/user_account.png' ),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  logout() {
    this.userService.Logout();
    this.router.navigate(['/home']);
  }
}

