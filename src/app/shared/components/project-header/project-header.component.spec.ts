import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHeaderComponent } from './project-header.component';

describe('ProjectHeaderComponent', () => {
  let component: ProjectHeaderComponent;
  let fixture: ComponentFixture<ProjectHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
