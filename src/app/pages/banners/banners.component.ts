import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { ModalsService } from 'src/app/core/services/modals.service';
import { Banner } from 'src/app/core/models/banners.model';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Router } from '@angular/router';
import { uploadFile } from '../../config/uploadFile';
import { BannersService } from 'src/app/core/services/banners.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { type } from 'os';
import { environment } from 'src/environments/environment';
import { ClientBanner } from 'src/app/core/models/client-banner.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})

export class BannersComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  banners: Banner[] = [];
  devices = [];
  selectedValue: string;
  valueSearch: string;
  valueSearchDate: string;
  valueSelectedDevice: string;
  tableFilters = [];
  valueSelectedValueStatus: string;
  statusDiscounts = [];
  loading: boolean;
  countryCode: CountryCodes;
  readonly ROOT_LANG = 'BANNERS.HOME.';
  selection = new SelectionModel<Banner>(true, []);
  displayedColumns: string[] = ['select', 'id', 'title', 'device', 'date', 'active', 'action'];
  dataSource: MatTableDataSource<Banner>;
  expandedElement: Banner | null;
  spaceRegex = /(\r\n|\n|\r)/gm;
  user: UserInfo;
  userLocal: UserLocal | null;
  valueSelectedImage: string;
  imageOptions = [];
  regexNullValue = [/;;;;/];

  private _unsubscribeAll: Subject<any>;


  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (this.dataSource) this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private ngxSpinner: NgxSpinnerService,
    private toastr: ToastrService,
    private bannersService: BannersService,
    private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal }>,
    private modalsService: ModalsService,
    private paginator: MatPaginatorIntl,
    private translateService: TranslateService,
    private cognitoService: CognitoService,
    private router: Router,
  ) {


    this._unsubscribeAll = new Subject();
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => {
      this.userLocal = userLocal;
      this.countryCode = userLocal.geoCountryCode;
    }));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  public openDeleteMultipleBannersModal(element: Banner[], action: string): void {
    this.modalsService.openDeleteMultiplesBannersModal(element, action);
  }


  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  masterToggle(): any {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Banner): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  ngOnInit(): void {


    this.loading = true;
    this.loadPaginator();
    this.getAllBanners();
    this.getFileS3();

  }

  private getAllBanners(): void {
    this.ngxSpinner.show();
    this.bannersService.getAllBanners().subscribe(
      async (res) => {

        res.data.forEach(banner => {
          banner.active = banner.active ? 'Si' : 'No';
          this.banners.push(banner);
        });

        this.bannersService.banners = this.banners;

        this.bannersService.onBannersChanged.next(this.banners);

        this.bannersService.onBannersChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.banners = this.bannersService.banners;
            this.matTableBannersFilters();

          });

        this.loading = false;
        this.ngxSpinner.hide();
      },
      (error) => this.toastr.error('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  matTableBannersFilters() {

    if (this.banners.length > 0) {
      this.dataSource = new MatTableDataSource(this.banners.sort(function (a, b) {
        return a.order - b.order;
      }));
      this.setupFilters(this.banners);
      this.setImageOptions();

      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.sort;
      this.ngxSpinner.hide();
      this.selection.clear();
      this.loading = false;
    }

  }

  public openUploadModal(): void {
    this.modalsService.openUploadFilesModal(uploadFile.boDiscretionaryDiscounts);
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
      if (value.id == 'title') this.tableFilters.splice(index, 1);
    });
    this.tableFilters.push({
      id: 'title',
      value: filterValue,
    });
    this.dataSource.filter = JSON.stringify(this.tableFilters);
  }


  private setupFilters(data): void {
    this.dataSource.filterPredicate = (data: Banner, filtersJson: string) => {
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
    this.devices = data.filter((thing, i, arr) => arr.findIndex((t) => t.device === thing.device) === i);

  }

  applyFilterDevice(): void {

    this.tableFilters.forEach((value, index) => {
      if (value.id == 'device') this.tableFilters.splice(index, 1);
    });


    let filterValue = this.valueSelectedDevice.slice(0, -1).trim();
    filterValue = filterValue.toLowerCase();
    var isAll: Boolean;

    isAll = filterValue == this.translateService.instant(this.ROOT_LANG + 'DEVICE').toLowerCase().slice(0, -1);

    if (!isAll) {
      this.tableFilters.push({
        id: 'device',
        value: filterValue,
      });
      this.dataSource.filter = JSON.stringify(this.tableFilters);
    }
    else {
      this.dataSource.filter = null;
    }

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

  applyFilterImages(): void {
    this.tableFilters.forEach((item, index) => {

      if (item.id === 'active') this.tableFilters.splice(index, 1);
    });

    let filterValue = this.valueSelectedImage.trim();
    let optionValue;

    var isAll: Boolean;

    switch (filterValue.toUpperCase()) {
      case 'NO':
        optionValue = 'No';
        break;
      case 'SI':
        optionValue = 'Si';
        break;
      default:
        optionValue = 'banners';
        break;
    }

    isAll = optionValue == 'banners';


    if (!isAll) {

      this.tableFilters.push({
        id: 'active',
        value: optionValue,
      });

      this.dataSource.filter = JSON.stringify(this.tableFilters);
    }
    else {
      this.dataSource.filter = null;
    }



  }

  clearFilters(): void {
    this.tableFilters = [];
    this.valueSearch = '';

    this.valueSelectedDevice = this.translateService.instant(this.ROOT_LANG + 'DEVICE')?.split(',');

    this.valueSelectedImage = this.translateService.instant(this.ROOT_LANG + 'ACTIVE')?.split(',');
    this.dataSource.filter = null;
  }


  private getFileS3(): void {

    this.ngxSpinner.show();
    this.cognitoService.readFileBlobInBucket(environment.B2B_LOAD_DATA_S3_HOST, environment.B2B_BO_BANNER_CLIENT_S3_HOST).then(
      async (resp) => {
        if (resp != 'undefined') {
          this.bannersService.clientBanners = this.dividerString(resp, this.spaceRegex);
        }

      });
  }


  dividerString(data, spacer): ClientBanner[] {
    const clientBanners: ClientBanner[] = [];
    var arrayString = data.split(spacer);
    for (var i = 1; i < arrayString.length; i++) {
      var array = arrayString[i].split(',');
      var clientBannerFilter = array.filter(item => item !== array);
      if (!this.spaceRegex.test(array)) {

        var isMatch = this.regexNullValue.some(function (rx) { return rx.test(clientBannerFilter); })
        if (!isMatch && clientBannerFilter[0]) {

          var clientBannerSplit = array[0].split(';');
          var clientBannerObj: ClientBanner = { CPG_ID: clientBannerSplit[0], COUNTRY_ID: clientBannerSplit[1], ORGANIZATION_ID: clientBannerSplit[2], BANNER_ID: clientBannerSplit[3], CLIENT_ID: clientBannerSplit[4] };

          clientBanners.push(clientBannerObj);
        }

      }

    }
    return clientBanners;

  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectRow(element: Banner, active: string): void {
    element.active = active === 'Si';
    this.bannersService.bannerSelect = element;

    this.router.navigate(['/main/detail-form-banner']);
  }


  addNew(): void {
    var element: Banner = { bannerId: 0, active: false, image: '', deleted: false, order: 10 };

    this.bannersService.bannerSelect = element;

    this.router.navigate(['/main/detail-form-banner']);
  }


  deleteSelection() {
    this.openDeleteMultipleBannersModal(this.selection.selected, 'deleteBannerSelection');
  }

}
