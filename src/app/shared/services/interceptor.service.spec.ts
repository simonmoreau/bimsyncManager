import { TestBed } from '@angular/core/testing';

import { InterceptorService } from './interceptor.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { Page404Component } from '../components/page404/page404.component';
import { HomeComponent } from 'src/app/home/home/home.component';
import { ProjectsComponent } from 'src/app/projects-list/projects/projects.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [ ProjectsComponent, HomeComponent, Page404Component   ],
    imports: [
      HttpClientModule,
      AppRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }));

  it('should be created', () => {
    const service: InterceptorService = TestBed.get(InterceptorService);
    expect(service).toBeTruthy();
  });
});
