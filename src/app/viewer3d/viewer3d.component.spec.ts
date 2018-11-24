import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewer3dComponent } from './viewer3d.component';

describe('Viewer3dComponent', () => {
  let component: Viewer3dComponent;
  let fixture: ComponentFixture<Viewer3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Viewer3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Viewer3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
