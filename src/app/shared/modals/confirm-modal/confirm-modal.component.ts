import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  @Input() public data;
  @Input() public showFooterButtons ?= true;
  @Output() modalResponse: EventEmitter<any> = new EventEmitter();
  constructor(public activeModal: NgbActiveModal) {
  }


  ngOnInit(): void { }

  confirm(): void {
    this.activeModal.close(true);
  }

  reject(): void {
    this.activeModal.close(false);
  }
}
