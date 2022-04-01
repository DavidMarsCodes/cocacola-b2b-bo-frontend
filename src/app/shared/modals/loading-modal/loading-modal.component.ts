import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss'],
})
export class LoadingModalComponent implements OnInit {
  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'indeterminate';

  constructor() {}

  ngOnInit(): void {}
}
