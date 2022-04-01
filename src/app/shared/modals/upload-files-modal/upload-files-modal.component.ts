import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-upload-files-modal',
  templateUrl: './upload-files-modal.component.html',
  styleUrls: ['./upload-files-modal.component.scss'],
})
export class UploadFilesModalComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() public data;
  private fileName: string;
  user: UserInfo;
  userLocal: UserLocal;
  readonly ROOT_LANG = 'UPLOAD_MODAL.';
  countryCode: string;
  dragAreaClass: string;
  file: File;
  cancelled = false;
  upload: any;
  paused = false;
  errorFormat: string;
  errorUpload: string;

  @HostListener('dragover', ['$event']) onDragOver(event: any): void {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter(event: any): void {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragend', ['$event']) onDragEnd(event: any): void {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: any): void {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event: any): void {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      this.onFileChange(event.dataTransfer.files);
    }
  }

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<{ userLocal: UserLocal; user: UserInfo }>,
    private cognitoService: CognitoService,
    private toastr: ToastrService,
    private translateService: TranslateService,
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.dragAreaClass = 'dragarea';
    this.fileName = this.data.fileName;
    this.errorFormat = this.translateService.instant(this.ROOT_LANG + 'ERROR_FORMATO')?.split(',');
    this.errorUpload = this.translateService.instant(this.ROOT_LANG + 'ERROR_UPLOAD')?.split(',');
  }

  close(): void {
    this.activeModal.close(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cancelUpload(): void {
    this.cancelled = true;
    this.cognitoService.cancelUploadFile(this.upload);
  }

  pauseUpload(): void {
    this.paused ? this.upload.resume() : this.upload.pause();
    this.paused = !this.paused;
  }

  formatPercent(percent): number {
    return parseInt(percent);
  }

  onFileChange(files): void {
    this.cancelled = false;
    this.file = files[0];
    if (this.file.type.indexOf('text/csv') || this.file.type.indexOf('application/vnd.ms-excel')) {
      try {
        this.upload = this.cognitoService.setFileToBucket(this.file, this.fileName);
      } catch (error) {
        this.toastr.error(this.errorUpload);
      }
    } else {
      this.toastr.error(this.errorFormat);
      this.file = undefined;
    }
  }

}
