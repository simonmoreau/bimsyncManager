import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BimsyncOauthComponent } from './bimsync-oauth.component';

describe('BimsyncOauthComponent', () => {
  let component: BimsyncOauthComponent;
  let fixture: ComponentFixture<BimsyncOauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BimsyncOauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BimsyncOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
