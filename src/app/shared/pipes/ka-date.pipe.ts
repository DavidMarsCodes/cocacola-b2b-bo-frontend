import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Pipe({
  name: 'kaDate',
})
export class KaDatePipe implements PipeTransform {
  constructor(private translateSrv: TranslateService) {}

  transform(isoDate: string, display): unknown {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (!date) return '';

    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    if (display === 'day mm/dd') {
      return `${this.getDayOfTheWeek(`${year}-${month}-${day}`)} ${day}/${month}`;
    }

    return `${day}/${month}/${year}`;
  }

  getDayOfTheWeek(date): void {
    const daysOfTheWeek = this.translateSrv.instant('DAYS_WEEK').split(',');
    return daysOfTheWeek[moment(date).day()];
  }
}
