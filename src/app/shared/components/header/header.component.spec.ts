import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ProjectsComponent } from 'src/app/projects-list/projects/projects.component';
import { HomeComponent } from 'src/app/home/home/home.component';
import { Page404Component } from '../page404/page404.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, ProjectsComponent, HomeComponent, Page404Component ],
      imports: [
        HttpClientModule,
        AppRoutingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a span tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('span').textContent).toContain('BimsyncManager');
  });
});
