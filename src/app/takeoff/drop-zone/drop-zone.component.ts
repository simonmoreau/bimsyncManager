import { Component, OnInit } from '@angular/core';
import { SelectedPropertiesService } from '../selected-properties.service';
import { Property } from '../selected-properties.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit {

  propertiesList$: BehaviorSubject<Property[]>;

  constructor(private propertiesService: SelectedPropertiesService) {

    this.propertiesList$ = propertiesService.propertiesListChange;
  }

  ngOnInit() {

  }

  public drop(event: CdkDragDrop<Property[]>) {
    this.propertiesService.changePropertyRank(event.previousIndex, event.currentIndex);
  }

}
