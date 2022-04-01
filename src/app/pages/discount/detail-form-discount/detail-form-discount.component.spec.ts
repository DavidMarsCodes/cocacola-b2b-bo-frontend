import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DiscretionaryDiscountService } from 'src/app/core/services/discretionary-discount.service';
import { of } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DetailFormDiscountComponent } from './detail-form-discount.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { DiscretionaryDiscount } from 'src/app/core/models/discretionary-discount.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

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

const discretionaryDiscount = {
  discountId: 0,
  validityTo: '2099-12-31T00:00:00.000Z',
  name: 'test',
  detail: 'test',
  discountType: '',
  limitPrice: 0,
  discounts: []
} as DiscretionaryDiscount;

const validResponse = {
  httpStatus: 201,
  ok: true,
  code: 0,
  data: [
    1
  ],
} as BERespModel;

describe('DetailFormDiscountComponent', () => {
  let component: DetailFormDiscountComponent;
  let fixture: ComponentFixture<DetailFormDiscountComponent>;

  let spyDiscretionaryDiscountService: jasmine.SpyObj<DiscretionaryDiscountService>;
  beforeEach(async () => {
    spyDiscretionaryDiscountService = jasmine.createSpyObj<DiscretionaryDiscountService>('DiscretionaryDiscountService', ['updateDiscretionaryDiscount']);
    spyDiscretionaryDiscountService.updateDiscretionaryDiscount.and.returnValue(of(validResponse));
    
    await TestBed.configureTestingModule({
      declarations: [DetailFormDiscountComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: DiscretionaryDiscountService, useValue: spyDiscretionaryDiscountService },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFormDiscountComponent);
    component = fixture.componentInstance;
    component.discretionaryDiscount = discretionaryDiscount;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit discretionary discount', () => {
    component.disocuntForm.value.discountId = 0;
    component.disocuntForm.value.name = 'test';
    component.disocuntForm.value.detail = 'test';
    component.disocuntForm.value.validityTo = 'any';
    component.disocuntForm.value.type = 'P';
    component.disocuntForm.value.type = 'limitPrice';
    component.saveChanges();
    expect(spyDiscretionaryDiscountService.updateDiscretionaryDiscount).toHaveBeenCalled();
  });

});
