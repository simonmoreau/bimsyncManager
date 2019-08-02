import { Component, OnInit, Input, OnChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { BimsyncService } from '../bimsync.service';
import { interval, BehaviorSubject, from, Observable, of } from 'rxjs';
import { PropertyPanelService } from '../property-panel/property-panel.service';
import { map, mergeAll, mergeMap } from 'rxjs/operators';
import { Product } from 'src/app/shared/models/bimsync.model';
declare var bimsync: any;

@Component({
  selector: 'app-bimsync-viewer',
  templateUrl: './bimsync-viewer.component.html',
  styleUrls: ['./bimsync-viewer.component.scss']
})
export class BimsyncViewerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() revisionIds: string[];
  @Input() projectId: string;
  @Input() highlightedProductsIds: string[] = new Array();

  private isLoaded: boolean;
  private areSpacesVisible = false;
  private areOtherVisible = true;
  private areOtherOpaque = true;
  private selectedProductsIds: string[] = new Array();

  @ViewChild('page', { static: false }) page: ElementRef;

  constructor(private bimsyncService: BimsyncService, private propertyPanelService: PropertyPanelService) { }

  ngOnInit() {

    this.isLoaded = false;

    this.bimsyncService.getViewer3DTokenForRevision(this.projectId, this.revisionIds).subscribe(token => {
      const viewer3dUrl = `https://api.bimsync.com/v2/projects/${this.projectId}/viewer3d/data?token=${token.token}`;
      const revisionIds$: Observable<string> = from(this.revisionIds);
      revisionIds$.pipe(
        map(revisionId => this.bimsyncService.listProducts(this.projectId, 'IfcSpace', revisionId)),
        mergeAll(),
        map(products => products.map(product => product.objectId))
      ).subscribe(spaceIds => {
        this.EnableViewer(viewer3dUrl, spaceIds);
      });
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

      if (this.highlightedProductsIds && this.highlightedProductsIds.length) {
        $viewer.viewer('resetColors');
        this.highlightedProductsIds.forEach(highlightedElementId => {
          $viewer.viewer('color', 'highlightedElement.color', highlightedElementId);
        });
      } else {
        $viewer.viewer('resetColors');
      }
    }
  }

  public ToogleSpaceVisibility() {
    const $viewer = $('#viewer-3d') as any;
    this.areSpacesVisible = !this.areSpacesVisible;
    $viewer.viewerUI('setSpacesVisible', this.areSpacesVisible);
  }

  public FocusModel() {
    const $viewer = $('#viewer-3d') as any;
    $viewer.viewer('viewpoint', 'home');
    $viewer.viewer('viewpoint', null, viewpoint => console.log(viewpoint));
  }

  public ToogleOthersVisibility() {
    const $viewer = $('#viewer-3d') as any;

    if (this.areOtherVisible) {
      // hide other
      $viewer.viewer('hideAll');
      this.areOtherVisible = false;
      const visibleProductdIds = this.highlightedProductsIds.concat(this.selectedProductsIds);

      if (visibleProductdIds.length !== 0) {
        visibleProductdIds.forEach(id => {
          $viewer.viewer('show', id);
        });
      } else {
        $viewer.viewer('hideAll');
      }
    } else {
      this.areOtherVisible = true;
      $viewer.viewer('showAll');
      // Don't show the spaces if they should be hidden
      if (!this.areSpacesVisible) { $viewer.viewerUI('setSpacesVisible', false); }
    }
  }
  public ToogleOtherTransparency() {
    const $viewer = $('#viewer-3d') as any;

    if (this.areOtherOpaque) {
      // hide other
      $viewer.viewer('translucentAll');
      this.areOtherOpaque = false;
      const visibleProductdIds = this.highlightedProductsIds.concat(this.selectedProductsIds);

      if (visibleProductdIds.length !== 0) {
        visibleProductdIds.forEach(id => {
          $viewer.viewer('show', id);
        });
      } else {
        $viewer.viewer('translucentAll');
      }
    } else {
      this.areOtherOpaque = true;
      $viewer.viewer('showAll');
      // Don't show the spaces if they should be hidden
      if (!this.areSpacesVisible) { $viewer.viewerUI('setSpacesVisible', false); }
    }
  }

  // ToogleOtherTransparency() {
  //   let $viewer = $("#viewer-3d") as any;

  //   if (this.otherDimmed) {
  //     // hide other
  //     $viewer.viewer("translucentAll");

  //     if (this.highlightedProductsIds.length !== 0) {
  //       this.highlightedProductsIds.forEach(highlightedElement => {
  //         $viewer.viewer("show", highlightedElement.ids);
  //       });
  //     } else {
  //       $viewer.viewer("translucentAll");
  //     }
  //     console.log(this.spacesVisibility);
  //   } else {
  //     $viewer.viewer("showAll");
  //   }

  //   this.ToogleSpaceVisibility();
  // }

  private EnableViewer(url3D: string, spacesIds: string[]): any {

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

      $viewer.viewerUI('setSpaces', spacesIds);

      $viewer.viewer('modelInfo', (modelInfos): void => {
        // This will print model info for all loaded models
        // console.log(modelInfos);
      });

      context.isLoaded = true;
    });

    $viewer.bind('viewer.select', (event: any, selected: string[]): void => {
      this.selectedProductsIds = selected;
      if (selected.length !== 0) {
        context.propertyPanelService.AddProducts(selected);
        // context.selectedProductId = selected[0];
      } else {
        context.propertyPanelService.AddProducts(new Array());
      }
    });
  }

}
