import { Injectable } from '@angular/core';
import { IUser } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: IUser;

  constructor() { }
}
