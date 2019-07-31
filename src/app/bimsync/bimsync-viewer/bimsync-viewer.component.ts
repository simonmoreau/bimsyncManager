import { Component, OnInit, Input, OnChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { BimsyncService } from '../bimsync.service';
import { interval, BehaviorSubject } from 'rxjs';
import { PropertyPanelService } from '../property-panel/property-panel.service';
declare var bimsync: any;

@Component({
  selector: 'app-bimsync-viewer',
  templateUrl: './bimsync-viewer.component.html',
  styleUrls: ['./bimsync-viewer.component.scss']
})
export class BimsyncViewerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() revisionIds: string[];
  @Input() spaceIds: number[];
  @Input() projectId: string;
  @Input() highlightedElements: any[];


  private isLoaded: boolean;
  private selectedProductId: string;

  @ViewChild('page', { static: false }) page: ElementRef;

  constructor(private bimsyncService: BimsyncService, private propertyPanelService: PropertyPanelService) { }

  ngOnInit() {

    this.isLoaded = false;

    this.bimsyncService.getViewer3DTokenForRevision(this.projectId, this.revisionIds).subscribe(token => {
      const viewer3dUrl = `https://api.bimsync.com/v2/projects/${this.projectId}/viewer3d/data?token=${token.token}`;
      this.EnableViewer(viewer3dUrl);
    });
  }

  ngAfterViewInit() {

    let width = this.page.nativeElement.offsetWidth;

    // Loop for size changes
    interval(100).subscribe((val) => {
      if (width !== this.page.nativeElement.offsetWidth) {
        width = this.page.nativeElement.offsetWidth;
        window.dispatchEvent(new Event('resize'));
      }
    });
  }

  ngOnChanges() {
    if (this.isLoaded) {
      const $viewer = $('#viewer-3d') as any;

      if (this.highlightedElements && this.highlightedElements.length) {
        $viewer.viewer('resetColors');
        this.highlightedElements.forEach(highlightedElement => {
          $viewer.viewer('color', highlightedElement.color, highlightedElement.ids);
        });
      } else {
        $viewer.viewer('resetColors');
      }
    }
  }



  private EnableViewer(url3D: string): any {

    const context = this;
    const $viewer = $('#viewer-3d') as any;
    let loading = true;

    bimsync.load(['viewer-ui']);

    bimsync.setOnLoadCallback((): void => {
      $viewer.viewer({
        translucentOpacity: 0.2,
        enableTouch: true,
        enableClippingPlaneWidget: true
      });

      $viewer.viewerUI({
        enableJoystick: true,
        enableTouch: true,
        enableKeyboard: true,
        joystickHidden: true,
        joystickColor: 'green',
        joystickPosition: 'bottom-center',
        joystickBorderOffset: '0px',
        enableContextMenu: true,
        viewer2dId: 'viewer-2d',
        enableViewer2dIntegration: true,
        showViewer2dStoreySelect: true,
        showViewer2dLockedNavigationToggle: true,
        set2dLockedNavigationMode: false
      });

      if (loading) {
        $viewer.viewer('loadUrl', url3D);
        loading = false;
      }

    });

    $viewer.bind('viewer.load', (event): void => {

      $('#viewer-container').focus();

      $viewer.viewer('clippingPlaneWidgetViewport', {
        x: 0,
        y: 350,
        width: 150,
        height: 150
      });

      $viewer.viewerUI('setSpaces', context.spaceIds);

      $viewer.viewer('modelInfo', (modelInfos): void => {
        // This will print model info for all loaded models
        // console.log(modelInfos);
      });

      context.isLoaded = true;
    });

    $viewer.bind('viewer.select', (event: any, selected: string[]): void => {
      if (selected.length !== 0) {
        context.propertyPanelService.AddProducts(selected);
        // context.selectedProductId = selected[0];
      } else {
        context.propertyPanelService.AddProducts(new Array());
      }
    });
  }

}
