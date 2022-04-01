import { Injectable, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DocsViewModalComponent } from 'src/app/shared/modals/docs-view-modal/docs-view-modal.component';
import { UploadFilesModalComponent } from 'src/app/shared/modals/upload-files-modal/upload-files-modal.component';
import { EditFileModalComponent } from 'src/app/shared/modals/edit-file-modal/edit-file-modal.component'
import { KeyWord } from 'src/app/core/models/keyword.model';
import { Banner } from 'src/app/core/models/banners.model';
import { DeleteMultipleModalComponent } from 'src/app/shared/modals/delete-multiple-modal/delete-multiple-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalsService implements OnDestroy {
  private subscriptions = new Subscription();
  constructor(private modalService: NgbModal) {
  }

  openDocsViewModal(title: String, fileName: String, nameDoc: String, nameBtn: String): void {
    const modalConfirm = this.modalService.open(DocsViewModalComponent, { windowClass: 'ngbmodal-centered', size: 'xl' });
    modalConfirm.componentInstance.data = {
      id: 'docs-view-modal',
      customClass: 'docs-view',
      fileName: fileName,
      titleModal: title,
      nameDoc: nameDoc,
      nameBtn: nameBtn,
    };
  }

  openUploadFilesModal(fileName: string): void {
    const modalConfirm = this.modalService.open(UploadFilesModalComponent, { windowClass: 'ngbmodal-centered', size: 'l' });
    modalConfirm.componentInstance.data = {
      id: 'upload-files-modal',
      fileName: fileName
    };
  }

  openEditFilesModal(element: KeyWord, fileEdit:Blob, action: string): void {
    const editConfirm = this.modalService.open(EditFileModalComponent, { windowClass: 'ngbmodal-centered', size: 'l' });
    editConfirm.componentInstance.data = {
      id: 'edit-file-modal',
      fileName: 'fileName',
      element: element,
      action:action,
      fileEdit: fileEdit
    };
  }

  openEditMasiveFilesModal(element: KeyWord[], fileEdit:Blob, action: string): void {
    const editConfirm = this.modalService.open(EditFileModalComponent, { windowClass: 'ngbmodal-centered', size: 'l' });
    editConfirm.componentInstance.data = {
      id: 'edit-file-modal',
      fileName: 'fileName',
      element: element,
      action:action,
      fileEdit: fileEdit
    };
  }

  openDeleteMultiplesBannersModal(banners: Banner[], action: string): void {
    const editConfirm = this.modalService.open(DeleteMultipleModalComponent, { windowClass: 'ngbmodal-centered', size: 'l' });
    editConfirm.componentInstance.data = {
      id: 'delete-banners-modal',
      banners: banners,
      action:action,
 
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
