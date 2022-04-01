import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DiscretionaryDiscountService } from 'src/app/core/services/discretionary-discount.service';
import { of } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DetailFormProductComponent } from './detail-form-product.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { DiscretionaryDiscount } from 'src/app/core/models/discretionary-discount.model';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

const product = {
  productId: 0,
  brand: '',
  category: 19,
  macrocategory: 1,
  erpProductId: '0',
  image: null,
  isFilter: 0,
  locked: false,
  name: '',
  package: '',
  size: ''
} as Product;

const validResponse = {
  httpStatus: 201,
  ok: true,
  code: 0,
  data: [
    1
  ],
} as BERespModel;


const validResponseCategories =
{
  httpStatus: 201,
  ok: true,
  code: 0,
  data: {
    categories: [
      { productGroupId: 1, name: 'Sin macrocategoria' },
      { productGroupId: 2, name: 'Otras Bebidas' },
      { productGroupId: 3, name: 'Cerveza' }
    ],

    macrocategories: [
      { productGroupId: 4, name: 'Bebidas' },
      { productGroupId: 5, name: 'Otras Bebidas' }
    ]
  },
};


describe('DetailFormProductComponent', () => {
  let component: DetailFormProductComponent;
  let fixture: ComponentFixture<DetailFormProductComponent>;

  let spyProductService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    spyProductService = jasmine.createSpyObj<ProductsService>('ProductService', ['updateProduct']);
    spyProductService.updateProduct.and.returnValue(of(validResponse));
    spyProductService.getCategoriesFilter.and.returnValue(of(validResponseCategories));

    await TestBed.configureTestingModule({
      declarations: [DetailFormProductComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: DiscretionaryDiscountService, useValue: spyProductService },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFormProductComponent);
    component = fixture.componentInstance;
    component.product = product;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit product', () => {
    component.productForm.value.productId = 0;

    component.saveChanges();
    expect(spyProductService.updateProduct).toHaveBeenCalled();
  });

});
