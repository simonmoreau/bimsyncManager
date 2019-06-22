import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUser } from '../../shared/models/user.model';

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

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.user = this.userService.user;
    this.clientId = this.userService.clientId;
    this.callbackUrl = this.userService.url + '/callback';
  }

}
