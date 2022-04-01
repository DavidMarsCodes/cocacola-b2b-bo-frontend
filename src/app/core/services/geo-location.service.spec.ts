import { TestBed } from '@angular/core/testing';

import { GeoLocationService } from './geo-location.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('GeoLocationService', () => {
  let service: GeoLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, StoreModule],
      providers: [provideMockStore({})]
    });
    service = TestBed.inject(GeoLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
