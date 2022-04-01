import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { getHomeStyle } from 'src/app/core/state/reducers/user.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  suggestedProducts: any[] = [];
  homeStyle: any;
  customOptions2: OwlOptions;
  private subscriptions = new Subscription();

  constructor(private store: Store<{ user: UserInfo; homeStyle: any; }>) {
    this.subscriptions.add(this.store.select(getHomeStyle).subscribe((homeStyle) => (this.homeStyle = homeStyle)));
  }

  ngOnInit(): void {
    this.customOptions2 = this.getCutomOptions();
  }

  getCutomOptions(): OwlOptions {
    return {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      autoplay: false,
      navSpeed: 700,
      margin: 10,
      navText: ['<', '>'],
      responsive: {
        0: {
          items: 2,
        },
        400: {
          items: 2,
        },
        740: {
          items: 2,
        },
        992: {
          items: 2,
        },
      },
      nav: false,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
