import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSelectorComponent } from './field-selector.component';

describe('FieldSelectorComponent', () => {
  let component: FieldSelectorComponent;
  let fixture: ComponentFixture<FieldSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
