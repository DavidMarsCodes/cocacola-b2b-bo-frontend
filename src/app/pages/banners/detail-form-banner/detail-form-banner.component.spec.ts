import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DiscretionaryDiscountService } from 'src/app/core/services/discretionary-discount.service';
import { of } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DetailFormBannerComponent } from './detail-form-banner.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { BannersService } from 'src/app/core/services/banners.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Banner } from 'src/app/core/models/banners.model';

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

const banner = {
  bannerId: 1
} as Banner;

const validResponse = {
  httpStatus: 201,
  ok: true,
  code: 0,
  data: [
    1
  ],
} as BERespModel;





describe('DetailFormBannerComponent', () => {
  let component: DetailFormBannerComponent;
  let fixture: ComponentFixture<DetailFormBannerComponent>;

  let spyBannersService: jasmine.SpyObj<BannersService>;

  beforeEach(async () => {
    spyBannersService = jasmine.createSpyObj<BannersService>('BannersService', ['updateBanner']);
    spyBannersService.updateBanner.and.returnValue(of(validResponse));

    await TestBed.configureTestingModule({
      declarations: [DetailFormBannerComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: DiscretionaryDiscountService, useValue: spyBannersService },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFormBannerComponent);
    component = fixture.componentInstance;
    component.banner = banner;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit banner', () => {


    component.saveChanges();
    expect(spyBannersService.updateBanner).toHaveBeenCalled();
  });

});
