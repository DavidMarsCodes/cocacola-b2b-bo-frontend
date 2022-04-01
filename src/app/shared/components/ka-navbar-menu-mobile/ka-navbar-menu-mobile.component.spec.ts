import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaNavbarMenuMobileComponent } from './ka-navbar-menu-mobile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('KaNavbarMenuMobileComponent', () => {
  let component: KaNavbarMenuMobileComponent;
  let fixture: ComponentFixture<KaNavbarMenuMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot(), StoreModule],
      declarations: [KaNavbarMenuMobileComponent],
      providers: [ TranslateService, provideMockStore({})
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaNavbarMenuMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
