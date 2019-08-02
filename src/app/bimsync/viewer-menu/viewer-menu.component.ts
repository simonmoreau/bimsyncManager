import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatIconRegistry, MatButtonToggleChange } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BimsyncViewerComponent } from '../bimsync-viewer/bimsync-viewer.component';

@Component({
  selector: 'app-viewer-menu',
  templateUrl: './viewer-menu.component.html',
  styleUrls: ['./viewer-menu.component.scss']
})
export class ViewerMenuComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private bimsyncViewer: BimsyncViewerComponent) {

      this.matIconRegistry.addSvgIcon(
        'hide_space',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/logos/space.svg')
      );
      this.matIconRegistry.addSvgIcon(
        'eye',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/logos/eye.svg')
      );
    }

  ngOnInit() {
  }

  ToogleSpaceVisibility(event: EventEmitter<MatButtonToggleChange>) {
    this.bimsyncViewer.ToogleSpaceVisibility();
  }

  FocusModel() {
    this.bimsyncViewer.FocusModel();
  }

  ToogleOthersVisibility(event: EventEmitter<MatButtonToggleChange>) {
    this.bimsyncViewer.ToogleOthersVisibility();
  }

  ToogleOtherTransparency(event: EventEmitter<MatButtonToggleChange>) {
    this.bimsyncViewer.ToogleOtherTransparency();
  }

}
