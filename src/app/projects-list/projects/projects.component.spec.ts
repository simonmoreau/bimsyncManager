import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { AppRoutingModule } from '../../app-routing.module';
import { HomeComponent } from 'src/app/home/home/home.component';
import { Page404Component } from 'src/app/shared/components/page404/page404.component';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsComponent, HomeComponent , Page404Component  ],
      imports: [ AppRoutingModule, HttpClientModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
