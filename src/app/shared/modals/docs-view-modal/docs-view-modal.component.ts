import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Store } from '@ngrx/store';

import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { UserInfo } from 'src/app/core/models/user-info.model';

@Component({
  selector: 'app-docs-modal',
  templateUrl: './docs-view-modal.component.html',
  styleUrls: ['./docs-view-modal.component.scss'],
})
export class DocsViewModalComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() public data;
  user: UserInfo;
  userLocal: UserLocal;
  readonly ROOT_LANG = 'MY_BENEFITS.HOME.';
  iframeSource: any;
  pdfUrl = environment.TYC_S3_HOST + 'assets/docs/';
  showIframe = true;
  reqPdfCounter = 0;
  nameDoc = '';
  iframeLoaded = false;
  title = '';
  file = '';
  iframeReloadInterval;
  nameBtn = '';

  constructor(
    private ngxSpinner: NgxSpinnerService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private store: Store<{ userLocal: UserLocal; user: UserInfo }>,
    private sanitizer: DomSanitizer
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.nameDoc = this.data.nameDoc;
    this.title = this.data.titleModal;
    this.pdfUrl = this.pdfUrl + this.data.fileName;
    this.nameBtn = this.data.nameBtn;

    const completeUrl = `http://docs.google.com/gview?url=${this.pdfUrl}/${this.user.cpgId}_${this.userLocal.geoCountryCode}_${this.userLocal.organizationId}_${this.nameDoc}.pdf&embedded=true`;

    this.iframeSource = this.sanitizer.bypassSecurityTrustResourceUrl(completeUrl);

    this.ngxSpinner.show();
    this.iframeReloadInterval = setInterval(() => this.retryLoadIframe(), 2500);
  }

  retryLoadIframe(): void {
    if (this.iframeLoaded) {
      clearInterval(this.iframeReloadInterval);
      return;
    }
    this.reqPdfCounter = this.reqPdfCounter + 1;
    if (this.reqPdfCounter === 6) {
      this.toastr.error('Ocurrió un error. Intente nuevamente.');
      this.ngxSpinner.hide();
      clearInterval(this.iframeReloadInterval);
      return;
    }
    //retry
    this.showIframe = false;

    setTimeout(() => (this.showIframe = true), 100);
  }

  iframeLoad(): void {
    this.ngxSpinner.hide();
    this.iframeLoaded = true;
  }

  close(): void {
    this.activeModal.close(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
