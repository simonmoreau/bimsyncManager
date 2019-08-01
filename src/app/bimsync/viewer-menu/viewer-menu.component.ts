import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-viewer-menu',
  templateUrl: './viewer-menu.component.html',
  styleUrls: ['./viewer-menu.component.scss']
})
export class ViewerMenuComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

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

}
