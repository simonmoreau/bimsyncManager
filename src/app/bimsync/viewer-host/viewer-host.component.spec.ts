import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerHostComponent } from './viewer-host.component';

describe('ViewerHostComponent', () => {
  let component: ViewerHostComponent;
  let fixture: ComponentFixture<ViewerHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
