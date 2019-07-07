import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionSelectionComponent } from './revision-selection.component';

describe('RevisionSelectionComponent', () => {
  let component: RevisionSelectionComponent;
  let fixture: ComponentFixture<RevisionSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
