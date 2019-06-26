import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUser } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: IUser;
  clientId: string;
  callbackUrl: string;

  private apiUrl = 'https://binsyncfunction-dev.azurewebsites.net/api';
  // private apiUrl = 'https://binsyncfunction-dev.azurewebsites.net/api';

  constructor(
    private router: Router,
    private userService: UserService) {
    this.userService.currentUser.subscribe(u => this.user = u);
    this.clientId = this.userService.clientId;
    this.callbackUrl = this.userService.url + '/callback';
  }

  ngOnInit() {
  }

  logout() {
    this.userService.Logout();
    this.router.navigate(['/home']);
  }
}

