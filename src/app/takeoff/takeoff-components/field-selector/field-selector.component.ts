import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DisplayProperty, GroupingMode, SortEnum } from '../../takeoff.model';

@Component({
  selector: 'app-field-selector',
  templateUrl: './field-selector.component.html',
  styleUrls: ['./field-selector.component.scss']
})
export class FieldSelectorComponent {

  GroupingMode: GroupingMode;
  isLast: boolean = false;
  isFirst: boolean = false;

  @Input() displayedProperty: DisplayProperty;
  @Output() propertyClosed: EventEmitter<string> = new EventEmitter<string>();
  @Output() propertyUpdated: EventEmitter<DisplayProperty> = new EventEmitter<DisplayProperty>();
  @Output() rankUpdated: EventEmitter<SortEnum> = new EventEmitter<SortEnum>();

  onUpdateProperty(value: GroupingMode): void {
    this.displayedProperty.groupingMode = value;
    this.propertyUpdated.emit(this.displayedProperty);
  }

  onUpdatePropertyRank(sort: number): void {
    switch (sort) {
      case 0: {
        this.rankUpdated.emit(SortEnum.Up);
        break;
      }
      case 1: {
        this.rankUpdated.emit(SortEnum.Down);
        break;
      }
      case 2: {
        this.rankUpdated.emit(SortEnum.ToTop);
        break;
      }
      case 3: {
        this.rankUpdated.emit(SortEnum.ToBottom);
        break;
      }
    }
  }

  onClosing(): void {
    this.propertyClosed.emit(this.displayedProperty.name);
  }
}
