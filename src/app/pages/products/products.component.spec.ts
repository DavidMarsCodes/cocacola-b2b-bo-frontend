import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { ProductsService } from '../../core/services/products.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsComponent } from './products.component';
import { MatTableExporterModule } from 'mat-table-exporter';

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

const filters = {
  name: 'Coca',
  brand: 'Powerade',
  category: 'Cerveza',
  image: 'NOT'
};

const validResponse = {
  httpStatus: 200,
  ok: true,
  code: 0,
  data: [
    {
      name: 'ENV. COCA-COLA RP 1 1/2 X 12',
      productId: 1,
      erpProductId: '000000000000020108',
      brand: 'brand',
      package: 'Wax Paperboard Brick Pack',
      size: '1.5 LTR',
      locked: 0,
      image: 'NOT',
      isFilter: 0,
      category: {
        id: 19,
        name: 'Sin categoria'
      },
      macrocategory: {
        id: 1,
        name: 'Sin macrocategoria'
      }
    },
    {
      name: 'ENV. COCA-COLA RP 2 LTS X 8',
      productId: 2,
      erpProductId: '000000000000020111',
      brand: '',
      package: 'Wax Paperboard Brick Pack',
      size: '2 LTR',
      locked: 0,
      image: 'NOT',
      isFilter: 0,
      category: {
        id: 19,
        name: 'Sin categoria'
      },
      macrocategory: {
        id: 1,
        name: 'Sin macrocategoria'
      }
    }

  ]
} as BERespModel;

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let spyProductService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {

    spyProductService = jasmine.createSpyObj<ProductsService>('ProductsService', ['getAllProducts']);
    spyProductService.getAllProducts.and.returnValue(of(validResponse));



    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [MatTableExporterModule, ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: ProductsService, useValue: spyProductService }

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filter by name', () => {
    component.applyFilter(filters.name)
    expect(component.dataSource.data).toBe(validResponse.data);
  });

  it('filter by brand ', () => {
    component.valueSelectedBrand = filters.brand;
    component.applyFilterBrand();
    expect(component.dataSource.data).toBe(validResponse.data);
  });

  it('filter by category ', () => {
    component.valueSelectedCategory = filters.category;
    component.applyFilterCategory;
    expect(component.dataSource.data).toBe(validResponse.data);
  });

  it('filter by image ', () => {
    component.valueSelectedImage = filters.image;
    component.applyFilterImages;
    expect(component.dataSource.data).toBe(validResponse.data);
  });

  it('should show all Products ', () => {
    expect(spyProductService.getAllProducts).toHaveBeenCalled();
    expect(component.products).toBe(validResponse.data);
  });
});
