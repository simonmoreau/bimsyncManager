import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  constructor() { }

  collapsed = false;

  ngOnInit() {
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }

}
