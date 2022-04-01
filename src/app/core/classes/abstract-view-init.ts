import { AfterViewInit, Directive } from '@angular/core';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class AbstractViewInit implements AfterViewInit {
  ngAfterViewInit(): void {
    this.hideSideBar();
  }

  hideSideBar(): void {
    if (!document) return;
    const sideBar = document.getElementById('side-bar-mobile')?.getElementsByClassName('container')[0] as HTMLElement;
    if (!sideBar || window.innerWidth >= 992) return;

    const inputs = document.getElementsByTagName('input');
    Array.from(inputs).forEach((input) => {
      input.addEventListener('focus', (event) => {
        sideBar.style.display = 'none';
      });
      input.addEventListener('blur', (event) => {
        sideBar.style.display = 'inherit';
      });
    });
  }
}
