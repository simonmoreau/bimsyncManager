import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BimsyncViewerComponent } from './bimsync-viewer.component';

describe('BimsyncViewerComponent', () => {
  let component: BimsyncViewerComponent;
  let fixture: ComponentFixture<BimsyncViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BimsyncViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BimsyncViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
