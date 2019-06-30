import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { ProjectsComponent } from '../projects-list/projects/projects.component';
import { HomeComponent } from '../home/home/home.component';
import { Page404Component } from '../shared/components/page404/page404.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [ ProjectsComponent, HomeComponent, Page404Component   ],
    imports: [
      HttpClientModule,
      AppRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
