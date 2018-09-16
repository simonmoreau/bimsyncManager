import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';
import * as prismjs from 'prismjs';

@Component({
    selector: 'app-documentation',
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

    appService: AppService;

    code = `
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

    code1 = `
  [
    {
        "projectName": “The name of your new project",
        "projectDescription": “The description of your new project",
        "users":[ … ]
        "models":[ ... ]
        "boards": [ … ]
    },
    {
        "projectName": “...",
        "projectDescription": “The description of your new project",
        ...
    }
  ]`;

    code2 = `
  {
      "id":"the Id of the new member",
      "role":"administrator"
  }`;

    code3 = `
  {
      “name":"The name of your model"
  }`;

    code4 = `
  {
      "name":"My new Issue Board",
      "statuses": [ … ],
      "types": [ … ]
  }`;

    code5 = `
  {
      "name":"Current",
      "color":"#e69138",
      "type":"candidate"
  }`;

    code6 = `
  {
      "name": "Warning",
      "color": "#e69138"
  },`;

    example = `
  [
    {
        "projectName": "00000 - My New Project",
        "projectDescription": "My new project description",
        "users":
        [
            {
                "id":"userid1",
                "role":"administrator"
            },
            {
                "id":"userid2",
                "role":"member"
            },
            {
                "id":"userid3",
                "role":"member"
            }
        ],
        "models":
        [
            {
                "name":"Architect"
            },
            {
                "name":"Structure"
            },
            {
                "name":"HVAC"
            }
        ],
        "boards":
        [
            {
                "name":"My New Issue Board",
                "statuses":
                [
                    {
                        "name":"New",
                        "color":"#dd7e6b",
                        "type":"open"
                    },
                    {
                        "name":"Current",
                        "color":"#e69138",
                        "type":"candidate"
                    },
                    {
                        "name":"Closed",
                        "color":"#6aa84f",
                        "type":"closed"
                    }
                ],
                "types":
                [
                    {
                        "name": "Error",
                        "color": "#cc0000"
                    },
                    {
                        "name": "Warning",
                        "color": "#e69138"
                    }
                ]
            },
            {
                "name":"My Second Issue Board",
                "statuses":
                [
                    {
                        "name":"New",
                        "color":"#dd7e6b",
                        "type":"open"
                    },
                    {
                        "name":"Current",
                        "color":"#e69138",
                        "type":"candidate"
                    },
                    {
                        "name":"Closed",
                        "color":"#6aa84f",
                        "type":"closed"
                    }
                ]
            }
        ]
    },
    {
        "projectName": "00000 - My Other New Project",
        "projectDescription": "My new project description"
    }
]`;

    constructor(private _appService: AppService) {
        this.appService = _appService;
    }

    ngOnInit() {

    }

}
