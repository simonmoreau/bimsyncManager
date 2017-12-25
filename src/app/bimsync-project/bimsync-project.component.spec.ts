import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BimsyncProjectComponent } from './bimsync-project.component';

describe('BimsyncProjectComponent', () => {
  let component: BimsyncProjectComponent;
  let fixture: ComponentFixture<BimsyncProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BimsyncProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BimsyncProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
