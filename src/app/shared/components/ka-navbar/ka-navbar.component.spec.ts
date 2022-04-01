import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaNavbarComponent } from './ka-navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

describe('KaNavbarComponent', () => {
  let component: KaNavbarComponent;
  let fixture: ComponentFixture<KaNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,  TranslateModule.forRoot()],
      declarations: [KaNavbarComponent],
      providers: [ TranslateService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
