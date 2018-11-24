import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as $ from "jquery";

declare var bimsync: any;

@Component({
  selector: 'app-viewer3d',
  templateUrl: './viewer3d.component.html',
  styleUrls: ['./viewer3d.component.scss']
})
export class Viewer3dComponent implements OnInit, AfterViewInit {

  viewer3dUrl: string;
  spaces: number[];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.viewer3dUrl = 'https://api.bimsync.com/v2/projects/42fef6fd1d4a412a9e53712af9f61665/viewer3d/data?token=a10d149a8dca4cdebde6ba4a64d86f03';
    this.spaces = [];

    this.EnableViewer();

  }

  EnableViewer(): any {
    let $viewer = $("#viewer-3d") as any;
    let url3D: string = this.viewer3dUrl;
    let spaceIds: number[] = this.spaces;

    bimsync.load(["viewer-ui"]);

    bimsync.setOnLoadCallback(function () {
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
        joystickColor: "green",
        joystickPosition: "bottom-center",
        joystickBorderOffset: "0px",
        enableContextMenu: true,
        viewer2dId: "viewer-2d",
        enableViewer2dIntegration: true,
        showViewer2dStoreySelect: true,
        showViewer2dLockedNavigationToggle: true,
        set2dLockedNavigationMode: false
      });

      $viewer.viewer("loadUrl", url3D);
    });

    $viewer.bind("viewer.load", function (event) {
      $("#viewer-container").focus();
      $viewer.viewer("clippingPlaneWidgetViewport", {
        x: 0,
        y: 320,
        width: 150,
        height: 150
      });

      $viewer.viewerUI("setSpaces", spaceIds);

      console.log("Viewer loaded!");

      $viewer.viewer('modelInfo', function (modelInfos) {
        console.log(modelInfos);
        // This will print model info for all loaded models
      });
    });

  }
}
