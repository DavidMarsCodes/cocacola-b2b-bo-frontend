import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { ModalsService } from 'src/app/core/services/modals.service';
import { KeyWord } from 'src/app/core/models/keyword.model';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Router } from '@angular/router';
import { uploadFile } from '../../config/uploadFile';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})

export class KeyWordsComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  keywords: KeyWord[] = [];
  selectedValue: string;
  valueSearch: string;
  valueSearchDate: string;
  valueSelectedValueStatus: string;
  statusDiscounts = [];
  loading: boolean;
  checked = false;
  countryCode: CountryCodes;
  readonly ROOT_LANG = 'KEYWORDS.HOME.';
  selection = new SelectionModel<KeyWord>(true, []);
  displayedColumns: string[] = ['select', 'title', 'keywords', 'action'];
  dataSource: MatTableDataSource<KeyWord>;
  expandedElement: KeyWord | null;
  spaceRegex = /(\r\n|\n|\r)/gm;
  fileEdit:Blob;
  user: UserInfo;
  userLocal: UserLocal | null;

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (this.dataSource) this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private ngxSpinner: NgxSpinnerService,
    private toastr: ToastrService,
    private amplifyService: CognitoService,
    private store: Store<{ user: UserInfo; homeStyle: any; userLocal: UserLocal }>,
    private modalsService: ModalsService,
    private paginator: MatPaginatorIntl,
    private translateService: TranslateService,
    private router: Router,
  ) {

    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => {
      this.userLocal = userLocal;
      this.countryCode = userLocal.geoCountryCode;
    }));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  public openEditModal(element: KeyWord,fileEdit :Blob, action:string): void {
    this.modalsService.openEditFilesModal(element,fileEdit, action);
  }

  public openEditMasiveModal(element: KeyWord[],fileEdit :Blob, action:string): void {
    this.modalsService.openEditMasiveFilesModal(element,fileEdit, action);
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

  checkboxLabel(row?: KeyWord): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadPaginator();
    this.getKeyWordsAmplify();
  }


  dividerString(data, spacer): KeyWord[] {
    const keywords: KeyWord[] = [];
    var arrayString = data.split(spacer);

    for (var i = 0; i < arrayString.length; i++) {
      var array = arrayString[i].split(',');
      var keywordsBeta = array.filter(item => item !== array[0])
      if (!spacer.test(array[0])) {
        var finalKeywords = keywordsBeta.map(item => item.trim());
        var keyword = { title: array[0], keywords: finalKeywords, select: false }
        keywords.push(keyword);
      }
    }
    return keywords;

  }


  private getKeyWordsAmplify(): void {
    this.ngxSpinner.show();
    this.amplifyService.readFileBlobInBucket(environment.KEYWORDS_ES_S3_HOST,`product_synonyms_${this.userLocal.cpgId}_${this.countryCode}_${this.userLocal.organizationId}_es.txt`).then(
      async (resp) => {
        if (resp != 'undefined') {
          this.keywords = this.dividerString(resp, this.spaceRegex);
          this.fileEdit = new Blob([resp], {type: "text/plain", endings: 'native'})
          if (this.keywords.length > 0) {
            this.dataSource = new MatTableDataSource(this.keywords);
            this.dataSource.paginator = this.matPaginator;
            this.dataSource.sort = this.sort;
            this.ngxSpinner.hide();
            this.loading = false;
          } else {
            this.ngxSpinner.hide();
            this.loading = false;
          }
        }

      });
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
    this.valueSearch = filterValue;
    this.dataSource.filter = filterValue;
  }

  applyFilterDate(filterValue: Object): void {
    this.dataSource.filter = filterValue['_i'].year + '-' + (filterValue['_i'].month + 1)
      + '-' + filterValue['_i'].date;
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
    this.valueSearchDate = '';
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectRow(element: KeyWord): void {
    this.openEditModal(element, this.fileEdit, 'editOne');
  }

  addNew() {
     this.openEditMasiveModal([],this.fileEdit, 'addNew');
  }
  editMasiveSelection() {
    if ((this.valueSearch !== "") && (this.checked)) {
      this.openEditMasiveModal(this.dataSource.filteredData, this.fileEdit, 'editMasive');
    } else {
      this.openEditMasiveModal(this.selection.selected, this.fileEdit, 'editMasive');
    }
  }

  deleteMasiveSelection() {
     this.openEditMasiveModal(this.selection.selected, this.fileEdit, 'deleteMasive');
  }

}
