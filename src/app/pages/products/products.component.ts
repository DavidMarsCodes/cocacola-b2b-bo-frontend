import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { ModalsService } from 'src/app/core/services/modals.service';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Router } from '@angular/router';
import { uploadFile } from 'src/app/config/uploadFile';
import { MatTableExporterDirective, MatTableExporterModule } from 'mat-table-exporter';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  products: Product[] = [];
  selectedValue: string;
  valueSearch: string;
  valueSearchDate: string;
  valueSelectedBrand: string;
  valueSelectedCategory: string;
  valueSelectedImage: string;
  brands = [];
  categorys = [];
  images = [];
  loading: boolean;
  countryCode: CountryCodes;
  tableFilters = [];
  imageOptions = [];
  readonly ROOT_LANG = 'PRODUCTS.HOME.';

  displayedColumns: string[] = ['erpProductId', 'name', 'brand', 'category', 'image', 'action'];
  dataSource: MatTableDataSource<Product>;
  expandedElement: Product | null;

  @ViewChild(MatTableExporterDirective, { static: false }) exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (this.dataSource) this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private toastr: ToastrService,
    private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal }>,
    private productService: ProductsService,
    private paginator: MatPaginatorIntl,
    private translateService: TranslateService,
    private router: Router,
    private modalsService: ModalsService
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadPaginator();
    this.getAllProducts();
  }

  public openUploadModal(): void {
    this.modalsService.openUploadFilesModal(uploadFile.boProducts);
  }


  private getAllProducts(): void {
    this.productService.getAllProducts().subscribe(
      async (res) => {
        this.products = res.data;
        if (this.products.length > 0) {
          this.dataSource = new MatTableDataSource(this.products);
          this.setupFilters(res.data);
          this.setDatasourceAttributes();
          this.setImageOptions();
        }
        this.loading = false;
      },
      (error) => this.toastr.error('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  private setDatasourceAttributes(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'category': return item.category.name;
        default: return item[property];
      }
    };
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.sort;
  }

  private setupFilters(data): void {
    this.dataSource.filterPredicate = (data: Product, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);
      filters.forEach((filter) => {
        const val = data[filter.id] === null ? '' : data[filter.id];
        if (typeof val === 'object') {
          matchFilter.push(val.name.toLowerCase().includes(filter.value.toLowerCase()));
        } else {
          matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
        }
      });
      return matchFilter.every(Boolean);
    };
    this.brands = data.filter((thing, i, arr) => arr.findIndex((t) => t.brand === thing.brand) === i);
    this.brands = this.brands.sort((a, b) => a.brand.localeCompare(b.brand));
    this.categorys = data.filter((thing, i, arr) => arr.findIndex((t) => t.category.id === thing.category.id) === i);
    this.categorys = this.categorys.sort((a, b) => a.category.name?.localeCompare(b.category.name));
    this.images = data.filter((thing, i, arr) => arr.findIndex((t) => t.image === thing.image) === i);
  }

  private setImageOptions(): void {
    this.translateService.use(this.countryCode).subscribe(() => {
      this.imageOptions = [
        this.translateService.instant(this.ROOT_LANG + 'IMAGE_SEARCH')?.split(','),
        this.translateService.instant(this.ROOT_LANG + 'NOT')?.split(','),
        this.translateService.instant(this.ROOT_LANG + 'YES')?.split(','),
      ];
      this.valueSelectedImage = this.imageOptions[0];
    });
  }

  private loadPaginator(): void {
    this.translateService.use(this.countryCode).subscribe(() => {
      this.paginator.itemsPerPageLabel = this.translateService.instant(this.ROOT_LANG + 'ITEMS_PER_PAGE_LABEL')?.split(',');
      this.paginator.nextPageLabel = this.translateService.instant(this.ROOT_LANG + 'NEXT_PAGE_LABEL')?.split(',');
      this.paginator.previousPageLabel = this.translateService.instant(this.ROOT_LANG + 'PREVIOUS_PAGE_LABEL')?.split(',');
      this.paginator.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        const separator = this.translateService.instant(this.ROOT_LANG + 'RANGE_LABEL')?.split(',');
        return `${startIndex + 1} - ${endIndex} ${separator} ${length}`;
      };
    });
  }

  applyFilter(filterValue: string): void {
    this.tableFilters.forEach((value, index) => {
      if (value.id == 'name') this.tableFilters.splice(index, 1);
    });
    this.tableFilters.push({
      id: 'name',
      value: filterValue,
    });
    this.dataSource.filter = JSON.stringify(this.tableFilters);
  }

  applyFilterBrand(): void {
    this.tableFilters.forEach((value, index) => {
      if (value.id == 'brand') this.tableFilters.splice(index, 1);
    });

    let filterValue = this.valueSelectedBrand.trim();
    filterValue = filterValue.toLowerCase();

    this.tableFilters.push({
      id: 'brand',
      value: filterValue,
    });

    this.dataSource.filter = JSON.stringify(this.tableFilters);
  }

  applyFilterCategory(): void {
    this.tableFilters.forEach((value, index) => {
      if (value.id == 'category') this.tableFilters.splice(index, 1);
    });
    let filterValue = this.valueSelectedCategory.trim();
    filterValue = filterValue.toLowerCase();
    this.tableFilters.push({
      id: 'category',
      value: filterValue,
    });
    this.dataSource.filter = JSON.stringify(this.tableFilters);
  }

  applyFilterImages(): void {
    this.tableFilters.forEach((item, index) => {
      if (item.id === 'image') this.tableFilters.splice(index, 1);
    });

    let filterValue = this.valueSelectedImage.trim();
    let optionValue;

    switch (filterValue) {
      case 'NO':
        optionValue = 'NOT';
        break;
      case 'SI':
        optionValue = 'products';
        break;
      default:
        optionValue = 'products';
        break;
    }

    this.tableFilters.push({
      id: 'image',
      value: optionValue,
    });
    this.dataSource.filter = JSON.stringify(this.tableFilters);
  }

  clearFilters(): void {
    this.tableFilters = [];
    this.valueSearch = '';
    this.valueSelectedBrand = this.translateService.instant(this.ROOT_LANG + 'TITLE_BRAND')?.split(',');
    this.valueSelectedCategory = this.translateService.instant(this.ROOT_LANG + 'CATEGORY_SEARCH')?.split(',');
    this.valueSelectedImage = this.translateService.instant(this.ROOT_LANG + 'IMAGE_SEARCH')?.split(',');
    this.dataSource.filter = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectRow(element: Product): void {
    this.productService.productSelect = element;
    this.router.navigate(['/main/detail-form-product']);
  }
}
