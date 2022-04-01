import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ka-vertical-image-menu',
  templateUrl: './ka-vertical-image-menu.component.html',
  styleUrls: ['./ka-vertical-image-menu.component.scss'],
})
export class KaVerticalImageMenuComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle?: string;
  @Input() button?: boolean;
  @Input() buttonText?: string;
  @Input() disabled: boolean;
  @Input() image: string;
  @Input() routerLink: string;
  constructor() {}

  ngOnInit(): void {}
}
