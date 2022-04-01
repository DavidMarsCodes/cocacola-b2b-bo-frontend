import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { ModalsService } from 'src/app/core/services/modals.service';
import { DiscretionaryDiscount } from 'src/app/core/models/discretionary-discount.model';
import { DiscretionaryDiscountService } from 'src/app/core/services/discretionary-discount.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Router } from '@angular/router';
import { uploadFile } from '../../config/uploadFile';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  discounts: DiscretionaryDiscount[] = [];
  selectedValue: string;
  valueSearch: string;
  valueSearchDateInit: string;
  valueSearchDateEnd: string;
  valueSelectedValueStatus: string;
  statusDiscounts = [];
  tableFilters = [];
  loading: boolean;
  ipType: string;
  countryCode: CountryCodes;
  readonly ROOT_LANG = 'DISCOUNTS.HOME.';

  displayedColumns: string[] = ['discountId', 'name', 'validityto', 'edit', 'published', 'action'];
  dataSource: MatTableDataSource<DiscretionaryDiscount>;
  expandedElement: DiscretionaryDiscount | null;

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (this.dataSource) this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private toastr: ToastrService,
    private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal }>,
    private modalsService: ModalsService,
    private discretionaryDiscountService: DiscretionaryDiscountService,
    private paginator: MatPaginatorIntl,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadPaginator();
    this.getDiscretionaryDiscounts();
  }

  private getDiscretionaryDiscounts(): void {
    this.discretionaryDiscountService.getAllDiscretionaryDiscount().subscribe(
      async (res) => {
        this.discounts = res.data;
        if (this.discounts.length > 0) {
          this.dataSource = new MatTableDataSource(this.discounts);
          this.setPredicateFilter();
          this.statusDiscounts = res.data.filter((thing, i, arr) => arr.findIndex((t) => t.deleted === thing.deleted) === i);
          this.setDatasourceAttributes();
        }
        this.loading = false;
      },
      (error) => this.toastr.error('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  private setDatasourceAttributes(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'validityto': return new Date(item.validityTo);
        case 'edit': return new Date(item.updatedTime);
        default: return item[property];
      }
    };
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.sort;
  }

  public openUploadModal(operation: string): void {
    if (operation === 'detail') {
      this.modalsService.openUploadFilesModal(uploadFile.boDiscretionaryDiscounts);
    } else {
      this.modalsService.openUploadFilesModal(uploadFile.assignDiscretionaryDiscounts);
    }
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

  applyFilter(): void {
    this.setPredicateFilter();
    this.tableFilters.forEach((value, index) => {
      if (value.id == 'name') this.tableFilters.splice(index, 1);
    });
    this.tableFilters.push({
      id: 'name',
      value: this.valueSearch,
    });
    this.dataSource.filter = JSON.stringify(this.tableFilters);
  }

  private setPredicateFilter(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      if (this.valueSearchDateEnd && this.valueSearchDateInit && this.valueSearch) {
        return (
          data.validityTo >= this.valueSearchDateInit &&
          data.validityTo <= this.valueSearchDateEnd &&
          data.name.toString().trim().toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1
        );
      }

      if (this.valueSearchDateEnd && this.valueSearchDateInit) {
        return data.validityTo >= this.valueSearchDateInit && data.validityTo <= this.valueSearchDateEnd;
      }
      if (this.valueSearch) {
        return data.name.toString().trim().toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1;
      }
      if (this.valueSearchDateEnd) {
        return data.validityTo <= this.valueSearchDateEnd;
      }
      if (this.valueSearchDateInit) {
        return data.validityTo >= this.valueSearchDateInit;
      }
      return true;
    };
  }

  applyFilterDate(filterValue: Object): void {
    this.dataSource.filterPredicate = (data, filter) => {
      if (this.valueSearchDateEnd && this.valueSearchDateInit && this.valueSearch) {
        return (
          data.validityTo >= this.valueSearchDateInit &&
          data.validityTo <= this.valueSearchDateEnd &&
          data.name.toString().trim().toLowerCase().indexOf(this.valueSearch.toLowerCase()) !== -1
        );
      }
      if (this.valueSearchDateEnd && this.valueSearchDateInit) {
        return data.validityTo >= this.valueSearchDateInit && data.validityTo <= this.valueSearchDateEnd;
      }
      if (this.valueSearchDateEnd) {
        return data.validityTo <= this.valueSearchDateEnd;
      }
      if (this.valueSearchDateInit) {
        return data.validityTo >= this.valueSearchDateInit;
      }
      return true;
    };
  }

  applyFilterStatus(): void {
    switch (this.valueSelectedValueStatus) {
      case 'Si':
        this.dataSource.filter = 'false';
        break;
      case 'No':
        this.dataSource.filter = 'true';
        break;
      default:
        this.dataSource.filter = null;
        break;
    }
  }

  clearFilterDate(): void {
    this.dataSource.filter = null;
    this.valueSearchDateInit = '';
    this.valueSearchDateEnd = '';
  }

  clearFilters(): void {
    this.valueSearch = '';
    this.valueSearchDateInit = '';
    this.valueSearchDateEnd = '';
    this.valueSelectedValueStatus = this.translateService.instant(this.ROOT_LANG + 'PUBLICATION_STATUS')?.split(',');
    this.dataSource.filter = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectRow(element: DiscretionaryDiscount): void {
    this.discretionaryDiscountService.discretionaryDiscountSelect = element;
    this.router.navigate(['/main/detail-form-discount']);
  }
}
