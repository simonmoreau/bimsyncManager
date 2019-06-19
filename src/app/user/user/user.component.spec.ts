import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the log in button in a <a> tag when no user are logged', () => {
    const compiled = fixture.debugElement.nativeElement;
    if (!component.user) {
      expect(compiled.querySelector('a').textContent).toContain('Log In');
    } else {
      expect(compiled.querySelector('a').textContent).toContain('Log In');
    }
  });
});
