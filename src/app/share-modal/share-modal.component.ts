import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {

  @ViewChild('content') content: any;
  share: boolean;

  constructor() { }

  ngOnInit() {
  }

  open() {
    this.share = true;
  }
}
