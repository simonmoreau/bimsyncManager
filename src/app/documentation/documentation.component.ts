import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';

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

  ngOnInit() {
  }

}
