import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/core/constants/constants';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { getHomeStyle } from 'src/app/core/state/reducers/user.reducer';

@Component({
  selector: 'app-ka-carousel',
  templateUrl: './ka-carousel.component.html',
  styleUrls: ['./ka-carousel.component.scss'],
})
export class KaCarouselComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  countrySelected: any;
  images;

  constructor(private store: Store<{ userLocal: UserLocal }>) {
    this.subscriptions.add(
      this.store.select('userLocal').subscribe((userLocal) => {
        this.countrySelected = Constants.countries.find((country) => country.key === userLocal.geoCountryCode);
        this.images = this.generateImages(this.countrySelected.lang);
      })
    );
  }

  ngOnInit(): void {}

  generateImages(lang: string): any[] {
    return [
      {
        desktop: `./assets/media/banners/banner-desktop-${lang}.jpg`,
        mobile: `./assets/media/banners/banner-mobile-${lang}.png`,
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
