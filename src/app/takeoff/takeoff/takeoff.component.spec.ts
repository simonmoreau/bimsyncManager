import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeoffComponent } from './takeoff.component';

describe('TakeoffComponent', () => {
  let component: TakeoffComponent;
  let fixture: ComponentFixture<TakeoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
