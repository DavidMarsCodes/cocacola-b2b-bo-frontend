import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ka-login-navbar',
  templateUrl: './ka-login-navbar.component.html',
  styleUrls: ['./ka-login-navbar.component.scss'],
})
export class KaLoginNavbarComponent implements OnInit {
  // tslint:disable-next-line: whitespace
  @Input() hasSelectCountry? = false;
  // tslint:disable-next-line: whitespace
  @Input() hasBackButton? = true;

  @Output() goStepBack = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  goPreviousStep(): void {
    this.goStepBack.emit();
  }
}
