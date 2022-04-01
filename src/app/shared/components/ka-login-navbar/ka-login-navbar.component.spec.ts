import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaLoginNavbarComponent } from './ka-login-navbar.component';

describe('KaLoginNavbarComponent', () => {
  let component: KaLoginNavbarComponent;
  let fixture: ComponentFixture<KaLoginNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaLoginNavbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaLoginNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
