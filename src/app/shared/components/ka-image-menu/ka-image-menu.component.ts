import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ka-image-menu',
  templateUrl: './ka-image-menu.component.html',
  styleUrls: ['./ka-image-menu.component.scss'],
})
export class KaImageMenuComponent implements OnInit {
  @Input() title: string;
  @Input() text?: string;
  @Input() icon: string;
  @Input() responsive ? = false;
  constructor() {}

  ngOnInit(): void {}
}
