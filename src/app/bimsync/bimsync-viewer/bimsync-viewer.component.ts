import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var bimsync: any;

@Component({
  selector: 'app-bimsync-viewer',
  templateUrl: './bimsync-viewer.component.html',
  styleUrls: ['./bimsync-viewer.component.scss']
})
export class BimsyncViewerComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    this.ViewModel();

  }

  ViewModel() {

    const projectId = 'e43d8c79d1c6409eb3dd871170b4d6b0';
    const baseUrl = 'https://api.bimsync.com/v2/projects/' + projectId + '/viewer3d/data?token=';

    const viewerToken = '60d8a1992870406b9d3f47e57956e984';
    const viewer3dUrl = baseUrl + viewerToken;

    this.EnableViewer(viewer3dUrl);
  }

  private EnableViewer(url3D: string): any {

    const $viewer = $('#viewer-3d') as any;

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

      $viewer.viewer('loadUrl', url3D);

    });

    // $viewer.bind("viewer.load", function (event) {

    //   $('#viewer-container').focus();

    //   $viewer.viewer('clippingPlaneWidgetViewport', {
    //     x: 0,
    //     y: 350,
    //     width: 150,
    //     height: 150
    //   });

    //   $viewer.viewerUI('setSpaces', context.spaceIds);

    //   context.isLoaded = true;

    //   $viewer.viewer('modelInfo', function (modelInfos) {
    //     // This will print model info for all loaded models
    //     console.log(modelInfos);
    //   });
    // });

    // $viewer.bind('viewer.select', function (event, selected) {

    //   console.log(selected);
    //   if (selected.length !== 0) {
    //     context.selectedProductId = selected[0];
    //   } else {
    //     context.selectedProductId = null;
    //   }
    // });
  }

}
