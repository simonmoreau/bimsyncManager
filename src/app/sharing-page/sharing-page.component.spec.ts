import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingPageComponent } from './sharing-page.component';

describe('SharingPageComponent', () => {
  let component: SharingPageComponent;
  let fixture: ComponentFixture<SharingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
