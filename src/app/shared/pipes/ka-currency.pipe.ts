import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { environment } from 'src/environments/environment';
import { EnviromentsTypes } from 'src/app/core/enums/enviroments-types';
@Pipe({
  name: 'kaCurrency',
})
export class KaCurrencyPipe implements PipeTransform {
  user: UserInfo;
  readonly CountryCodes = CountryCodes;
  readonly EnviromentsTypes = EnviromentsTypes;

  constructor(private store: Store<{ user: UserInfo }>) {
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  transform(value: any, ...args: unknown[]): unknown {
    let parsedNumber;
    switch (this.user.countryId) {
      case CountryCodes.CHILE:
        parsedNumber = this.parseRegular(value, '$');
        break;
      case CountryCodes.ARGENTINA:
        parsedNumber = this.parseRegular(value, '$');
        break;
      case CountryCodes.PARAGUAY:
        parsedNumber = this.parseRegular(value, '₲');
        break;
      case CountryCodes.BRASIL:
        parsedNumber = this.parseRegular(value, 'R$');
        break;
      default:
        parsedNumber = this.parseRegular(value, '$');
    }

    return `${parsedNumber}`;
  }

  parseRegular(value: any, symbol: string): string {
    const finalValue = parseFloat(value)
      ?.toString()
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${symbol}${finalValue}`;
  }

  parseWithDecimals(value: any): string {
    return parseFloat(value)
      ?.toFixed(2)
      .toString()
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  parseWithRound(value: any): string {
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
