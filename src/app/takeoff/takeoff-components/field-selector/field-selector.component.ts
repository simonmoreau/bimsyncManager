import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-field-selector',
  templateUrl: './field-selector.component.html',
  styleUrls: ['./field-selector.component.scss']
})
export class FieldSelectorComponent implements OnChanges {

  summarize:boolean = true;
  first:boolean = false;
  last:boolean = false;
  countDistinct: boolean = false;
  count:boolean = false;

  @Input() propertyName: string;
  @Output() propertyClicked: EventEmitter<string> =
          new EventEmitter<string>();

  ngOnChanges(): void {
      // this.starWidth = this.rating * 86 / 5;
  }

  onClick(): void {
      this.propertyClicked.emit(`The property ${this.propertyName} was clicked!`);
  }
}
