import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { ModalsService } from 'src/app/core/services/modals.service';
import { NpsPoll } from 'src/app/core/models/nps-poll.model';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Router } from '@angular/router';
import { uploadFile } from '../../config/uploadFile';
import { NpsService } from 'src/app/core/services/nps.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { type } from 'os';
import { environment } from 'src/environments/environment';
import { ClientBanner } from 'src/app/core/models/client-banner.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nps-poll',
  templateUrl: './nps-poll.component.html',
  styleUrls: ['./nps-poll.component.scss']
})

export class NpsPollComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  polls: NpsPoll[] = [];
  dates = [];
  selectedValue: string;
  valueSearch: string;
  valueSearchDate: string;

  tableFilters = [];
  valueSelectedValueStatus: string;
  statusDiscounts = [];
  loading: boolean;
  countryCode: CountryCodes;
  readonly ROOT_LANG = 'NPS.HOME.';
  selection = new SelectionModel<NpsPoll>(true, []);
  displayedColumns: string[] = ['number', 'poll', 'validity', 'validity_date', 'action'];
  dataSource: MatTableDataSource<NpsPoll>;
  expandedElement: NpsPoll | null;
  spaceRegex = /(\r\n|\n|\r)/gm;
  user: UserInfo;
  userLocal: UserLocal | null;
  valueSelectedActive: string;
  activeOptions = [];
  regexNullValue = [/;;;;/];

  private _unsubscribeAll: Subject<any>;


  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (this.dataSource) this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private ngxSpinner: NgxSpinnerService,
    private toastr: ToastrService,
    private npsService: NpsService,
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

  public openDeleteMultipleBannersModal(element: NpsPoll[], action: string): void {
    // this.modalsService.openDeleteMultiplesBannersModal(element, action);
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


  ngOnInit(): void {


    this.loading = true;
    this.loadPaginator();
    this.getAllNpsPolls();
  }

  private getAllNpsPolls(): void {
    this.ngxSpinner.show();
    this.npsService.getAllNpsPoll().subscribe(
      async (res) => {

        res.data.forEach(polls => {
          polls.active = polls.active ? 'Si' : 'No';
          this.polls.push(polls);
        });

        this.npsService.polls = this.polls;

        this.npsService.onNpsPollsChanged.next(this.polls);

        this.npsService.onNpsPollsChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(() => {
            this.polls = this.npsService.polls;
            this.matTablePollsFilters();

          });

        this.loading = false;
        this.ngxSpinner.hide();
      },
      (error) => this.toastr.error('Ocurrió un error inesperado. Por favor envíelo nuevamente.')
    );
  }

  matTablePollsFilters() {

    if (this.polls.length > 0) {
      this.dataSource = new MatTableDataSource(this.polls);
      this.setupFilters(this.polls);
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
      if (value.id == 'mainQuestion') this.tableFilters.splice(index, 1);
    });
    this.tableFilters.push({
      id: 'mainQuestion',
      value: filterValue,
    });

    this.dataSource.filter = JSON.stringify(this.tableFilters);
  }


  private setupFilters(data): void {

    this.dataSource.filterPredicate = (data: NpsPoll, filtersJson: string) => {
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

    this.dates = data.filter((thing, i, arr) => arr.findIndex((t) => t.createdTime === thing.createdTime) === i);

  }

  applyFilterDate(): void {
    this.tableFilters.forEach((value, index) => {
      if (value.id == 'createdTime') this.tableFilters.splice(index, 1);
    });


    let filterValue = this.valueSearchDate.slice(0, -1).trim();
    filterValue = filterValue.toLowerCase();

    this.tableFilters.push({
      id: 'createdTime',
      value: filterValue,
    });

    this.dataSource.filter = (filterValue != this.translateService.instant(this.ROOT_LANG + 'SEARCH_BY_DATE').toLowerCase().slice(0, -1)) ? JSON.stringify(this.tableFilters) : null;
  }


  private setImageOptions(): void {
    this.translateService.use(this.countryCode).subscribe(() => {
      this.activeOptions = [
        this.translateService.instant(this.ROOT_LANG + 'SEARCH_BY_DATE')?.split(','),
        this.translateService.instant(this.ROOT_LANG + 'ACTIVE')?.split(','),
        this.translateService.instant(this.ROOT_LANG + 'NOT')?.split(','),
        this.translateService.instant(this.ROOT_LANG + 'YES')?.split(','),
      ];
      this.valueSearchDate = this.activeOptions[0];
      this.valueSelectedActive = this.activeOptions[1];
    });
  }

  applyFilterActive(): void {
    this.tableFilters.forEach((item, index) => {
      if (item.id === 'active') this.tableFilters.splice(index, 1);
    });

    let filterValue = this.valueSelectedActive.trim();
    let optionValue;

    switch (filterValue.toUpperCase()) {
      case 'NO':
        optionValue = 'No';
        break;
      case 'SI':
        optionValue = 'Si';
        break;
      default:
        optionValue = 'polls';
        break;
    }

    this.tableFilters.push({
      id: 'active',
      value: optionValue,
    });

    this.dataSource.filter = optionValue !== 'polls' ? JSON.stringify(this.tableFilters) : null;
  }

  clearFilters(): void {
    this.tableFilters = [];
    this.valueSearch = '';

    this.valueSearchDate = this.translateService.instant(this.ROOT_LANG + 'SEARCH_BY_DATE')?.split(',');

    this.valueSelectedActive = this.translateService.instant(this.ROOT_LANG + 'ACTIVE')?.split(',');
    this.dataSource.filter = null;
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

  selectRow(element: NpsPoll): void {

    this.npsService.npsPollSelect = element;

    this.router.navigate(['/main/nps-poll']);
  }


  addNew(): void {
    var element: NpsPoll = { pollId: 0, active: "Si", secondaryActive: false, applyToAll: false };

    this.npsService.npsPollSelect = element;

    this.router.navigate(['/main/nps-poll']);
  }


  deleteSelection() {
    this.openDeleteMultipleBannersModal(this.selection.selected, 'deleteBannerSelection');
  }

}
