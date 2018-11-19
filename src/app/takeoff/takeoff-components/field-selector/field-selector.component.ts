import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DisplayProperty, GroupingMode } from '../../takeoff.model';

@Component({
  selector: 'app-field-selector',
  templateUrl: './field-selector.component.html',
  styleUrls: ['./field-selector.component.scss']
})
export class FieldSelectorComponent implements OnChanges {

  GroupingMode: GroupingMode;
  isLast: boolean = false;
  isFirst: boolean = false;

  @Input() displayedProperty: DisplayProperty;
  @Input() selectedValueProperties: DisplayProperty[];
  @Output() propertyClosed: EventEmitter<string> = new EventEmitter<string>();
  @Output() propertyUpdated: EventEmitter<DisplayProperty> = new EventEmitter<DisplayProperty>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.selectedValueProperties.currentValue);
    console.log(changes.selectedValueProperties.previousValue);
    let index = this.selectedValueProperties.indexOf(this.displayedProperty);
    if (index === 0) {this.isFirst = true; }
    if (index === this.selectedValueProperties.length - 1 ) {this.isLast = true; }
  }

  onUpdateProperty(value: GroupingMode): void {
    this.displayedProperty.groupingMode = value;
    this.propertyUpdated.emit(this.displayedProperty);
  }

  onUpdatePropertyRank(): void {

  }

  onClosing(): void {
      this.propertyClosed.emit(this.displayedProperty.name);
  }
}
