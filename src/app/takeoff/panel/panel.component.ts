import { Component, OnInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  constructor(public elementRef: ElementRef) { }

  @Input() title: string;

  collapsed = false;

  /** Whether the panel is left oriented. */
  readonly isLeftOriented: boolean = this._hasHostAttributes('left');

  ngOnInit() {
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }

  /** Gets whether the panel has one of the given attributes. */
  _hasHostAttributes(...attributes: string[]) {
    return attributes.some(attribute => this._getHostElement().hasAttribute(attribute));
  }

  _getHostElement() {
    return this.elementRef.nativeElement;
  }

}
