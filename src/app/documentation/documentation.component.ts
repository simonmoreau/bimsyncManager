import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';
import * as prismjs from 'prismjs';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

  appService:AppService;

  constructor(private _appService: AppService) {
      this.appService = _appService;
  }

  private code = `
  [
    {
      "name":"En cours",
      "color":"#e69138",
      "type":"candidate"
    },
    {
      ...
    }
  ]`;

  private code1 =`
  [
    {
        "projectName": “The name of your new project",
        "projectDescription": “The description of your new project",
        "users”:[ … ]
        "models”:[ ... ] 
        "boards”: [ … ] 
    },
    {
        "projectName": “...",
        "projectDescription": “The description of your new project”,
        ...
    }
  ]`;

  private code2 =`
  {
      "id”:”the Id of the new member",
      "role":"administrator"
  }`;

  private code3 =`
  {
    “name”:”The name of your model"
  }`;

  private code4 =`
  {
    "name":"Questions de conception",
    "statuses”: [ … ],
    “types”: [ … ]
}`;

private code5=`
{
  "name":"En cours",
  "color":"#e69138",
  "type":"candidate"
}`;

private code6=`
{
  "name": "Avertissement",
  "color": "#e69138"
},`;

  ngOnInit() {
    
  }

}
