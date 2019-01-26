import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPanelComponent } from './property-panel.component';

describe('PropertyPanelComponent', () => {
  let component: PropertyPanelComponent;
  let fixture: ComponentFixture<PropertyPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
