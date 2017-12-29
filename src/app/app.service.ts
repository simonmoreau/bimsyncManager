import { Injectable } from '@angular/core';
import { IUser} from './bimsync-oauth/user';
import { _document } from '@angular/platform-browser/src/browser';

@Injectable()
export class AppService {

  constructor() { }

       // private instance for the current user
       private _user : IUser;

       public SetCurrentUser(user : IUser){
         this._user = user;
       }

       public GetCurrentUser(){
         return this._user;
       }

}
