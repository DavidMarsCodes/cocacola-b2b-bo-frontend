import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSelectCountryComponent } from './ka-select-country.component';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

const initialState = {
  client: {
    clientId: '001',
    organizationId: '124',
  },
  userLocal: {
    geoCountryCode: 'CL',
  },
  user: {
    countryId: 'CL',
  },
};

describe('KaSelectCountryComponent', () => {
  let component: KaSelectCountryComponent;
  let fixture: ComponentFixture<KaSelectCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), StoreModule],
      declarations: [KaSelectCountryComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSelectCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
