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
  // url: string = 'https://bimsyncmanager.firebaseapp.com';
  url = 'http://localhost:4200';
  callbackUrl: string = this.url + '/callback';
    // client_id = '6E63g0C2zVOwlNm';
  clientId = 'hl94XJLXaQe3ogX';

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
