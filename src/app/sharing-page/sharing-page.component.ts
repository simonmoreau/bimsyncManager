import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { TakeoffService } from "../takeoff/takeoff.services";
import * as $ from "jquery";
import { flatten } from "@angular/compiler";

declare var bimsync: any;

@Component({
    selector: "app-sharing-page",
    templateUrl: "./sharing-page.component.html",
    styleUrls: ["./sharing-page.component.scss"],
    providers: [TakeoffService]
})
export class SharingPageComponent implements OnInit, AfterViewInit {
    spacesVisibility: boolean = false;
    twoDVisibility: boolean = true;
    towDLarge: boolean = false;
    models: IModel[] = [];
    viewer2dUrl: string;
    viewer3dUrl: string;
    spaces: number[];
    errorMessage: string;
    sharingCodeId: string = '';
    originPosition: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private _takeoffService: TakeoffService
    ) { }

    ngOnInit() {
        // subscribe to router event and retrive the callback code
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.sharingCodeId = params["code"];
        });
    }

    ngAfterViewInit() {
        this._takeoffService.GetSharingCode(this.sharingCodeId).subscribe(
            sharingCode => {
                sharingCode.SharedModels.forEach(sharedModel => {
                    let newModel: IModel = {
                        id: sharedModel.id,
                        name: sharedModel.name,
                        isVisible: true
                    };
                    this.models.push(newModel);
                });
                this.viewer2dUrl = sharingCode.Viewer2dToken.url;
                this.viewer3dUrl = sharingCode.Viewer3dToken.url;
                this.spaces = sharingCode.SpacesId;

                this.EnableViewer();
            },
            error => (this.errorMessage = <any>error)
        );
    }

    EnableViewer(): any {
        let $viewer = $("#viewer-3d") as any;
        let $viewer2d = $("#viewer-2d") as any;
        let url2D: string = this.viewer2dUrl;
        let url3D: string = this.viewer3dUrl;
        let spaceIds: number[] = this.spaces;
        let context: any = this;

        // 2D Viewer
        bimsync.loadViewer2d();

        bimsync.setOnViewer2dLoadCallback(function () {
            $viewer2d.viewer2d("loadUrl", url2D);

            $viewer2d.bind("loaded", function (event) {
                console.log("2D Viewer loaded!");
            });

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
                    joystickHidden: false,
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
                    y: 0,
                    width: 150,
                    height: 150
                });

                $viewer.viewerUI("setSpaces", spaceIds);

                console.log("Viewer loaded!");

                // Get current viewpoint for future references
                $viewer.viewer('viewpoint', null, function (viewpoint) {
                    context.originPosition = viewpoint;
                });
            });
        });
    }

    ToogleSpaceVisibility() {
        let $viewer = $("#viewer-3d") as any;
        $viewer.viewerUI("setSpacesVisible", this.spacesVisibility);
    }

    ToogleModelVisibility(model: IModel) {
        let $viewer = $("#viewer-3d") as any;
        if (model.isVisible) {
            $viewer.viewer("hideModel", model.id);
        } else {
            $viewer.viewer("showModel", model.id);
        }
    }

    Toogle2D() {
        if (this.twoDVisibility) {
            this.twoDVisibility = false;
        } else {
            this.twoDVisibility = true;
        }
    }

    ToogleEnlarge() {
        if (this.towDLarge) {
            this.towDLarge = false;
        } else {
            this.towDLarge = true;
        }
    }

    FocusModel() {
        let $viewer = $("#viewer-3d") as any;
        $viewer.viewer('viewpoint', this.originPosition);

        $viewer.viewer('viewpoint', null, function (viewpoint) {
            console.log(viewpoint);
        });
    }
}

export interface IModel {
    id: string;
    name: string;
    isVisible: boolean;
}
