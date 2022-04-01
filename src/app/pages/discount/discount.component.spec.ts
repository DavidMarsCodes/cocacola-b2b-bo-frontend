import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { DiscretionaryDiscountService } from '../../core/services/discretionary-discount.service';
import { ModalsService } from 'src/app/core/services/modals.service';
import { DiscountComponent } from './discount.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu'

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

const validResponse = {
  httpStatus: 200,
  ok: true,
  code: 0,
  data: [
    {
      discountId: 415,
      validityTo: '2099-12-31T00:00:00.000Z',
      discountType: 'P',
      name: 'Coca-Cola Zero 2.0',
      detail: '',
      limitPrice: '1100.000',
      updatedTime: '2021-10-23T02:06:59.000Z',
      deleted: false,
      amountDiscount: [
        '9.700'
      ]
    },
    {
      discountId: 503,
      validityTo: '2021-12-31T00:00:00.000Z',
      discountType: 'P',
      name: 'Coca-Cola Zero',
      detail: 'Segunda descripción ',
      limitPrice: '2000.000',
      updatedTime: '2021-10-22T16:05:29.000Z',
      deleted: false,
      amountDiscount: [
        '22.200'
      ]
    }
  ]
} as BERespModel;

describe('DiscountComponent', () => {
  let component: DiscountComponent;
  let fixture: ComponentFixture<DiscountComponent>;
  let spyDiscretionaryDiscountService: jasmine.SpyObj<DiscretionaryDiscountService>;


  beforeEach(async () => {
    spyDiscretionaryDiscountService = jasmine.createSpyObj<DiscretionaryDiscountService>('DiscretionaryDiscountService', ['getAllDiscretionaryDiscount']);
    spyDiscretionaryDiscountService.getAllDiscretionaryDiscount.and.returnValue(of(validResponse));

    await TestBed.configureTestingModule({
      declarations: [DiscountComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot(), MatMenuModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: DiscretionaryDiscountService, useValue: spyDiscretionaryDiscountService }

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all discretionary discounts ', () => {
    expect(spyDiscretionaryDiscountService.getAllDiscretionaryDiscount).toHaveBeenCalled();
    expect(component.discounts).toBe(validResponse.data);
  });


});
