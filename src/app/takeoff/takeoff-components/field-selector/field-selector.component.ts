import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { IDisplayProperty, GroupingMode } from '../../takeoff.model';

@Component({
  selector: 'app-field-selector',
  templateUrl: './field-selector.component.html',
  styleUrls: ['./field-selector.component.scss']
})
export class FieldSelectorComponent implements OnChanges {

  summarize: boolean = true;
  first: boolean = false;
  last: boolean = false;
  countDistinct: boolean = false;
  count: boolean = false;
  GroupingMode: GroupingMode;

  @Input() displayedProperty: IDisplayProperty;
  @Output() propertyClosed: EventEmitter<string> = new EventEmitter<string>();
  @Output() propertyUpdated: EventEmitter<IDisplayProperty> = new EventEmitter<IDisplayProperty>();

  ngOnChanges(): void {
      // this.starWidth = this.rating * 86 / 5;
  }

  onUpdateProperty(value: string): void {
    
  }

  onClosing(): void {
      this.propertyClosed.emit(this.displayedProperty.name);
  }
}
