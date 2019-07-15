import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-viewer-host',
  templateUrl: './viewer-host.component.html',
  styleUrls: ['./viewer-host.component.scss']
})
export class ViewerHostComponent implements OnInit, OnChanges {

  @Input() revisionIds: string[];
  @Input() spaceIds: number[];
  @Input() projectId: string;
  @Input() highlightedElements: any[];

  showViewer: boolean;

  constructor() { }

  ngOnInit() {
    this.showViewer = true;
  }

  ngOnChanges() {
    this.showViewer = false;

    // Ugly hack to reload the viewer when I change something
    setTimeout( () => {
      this.showViewer = true;
    }, 10);
  }

}
