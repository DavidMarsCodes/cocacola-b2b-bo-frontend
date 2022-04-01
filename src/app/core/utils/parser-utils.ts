import * as _ from 'lodash';
import { CountryCodes } from '../enums/country-codes.enum';
import * as moment from 'moment';

export class ParserUtils {
  readonly CountryCodes = CountryCodes;
  constructor() {}

  static set0ToErpClientId = (erpClientId: string, geoCountryCode: CountryCodes): string => {
    switch (geoCountryCode) {
      case CountryCodes.CHILE:
      case CountryCodes.PARAGUAY:
        return erpClientId.startsWith('0') ? erpClientId : '0' + erpClientId;
      default:
        return erpClientId;
    }
  }
  
  static removes0FromErpClientId = (erpClientId: string, geoCountryCode: CountryCodes): string => {
    switch (geoCountryCode) {
      case CountryCodes.CHILE:
        return parseInt(erpClientId) + '';
      default:
        return erpClientId;
    }
  }

  static set0ToFiscalId = (fiscalId: string, geoCountryCode: CountryCodes): string => {
    switch (geoCountryCode) {
      case CountryCodes.CHILE:
        const rut = fiscalId.split('-');
        const rutNumber = rut[0];
        return rutNumber?.length === 7 ? '0' + fiscalId : fiscalId;
      default:
        return fiscalId;
    }
  }

  static removes0FromFiscalId = (fiscalId: string, geoCountryCode: CountryCodes): string => {
    switch (geoCountryCode) {
      case CountryCodes.CHILE:
        const rut = fiscalId.split('-');
        const rutNumber = rut[0];
        const suffix = rut[1];
        return parseInt(rutNumber) + '-' + suffix;
      default:
        return fiscalId;
    }
  }

  static parseDateToHHMM(date): string {
    if (!date) return '';
    const newDate = new Date(date);
    const hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
    const minutes = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();
    return hours + ':' + minutes;
  }

  static adjustDeadlineByTimeZone(data): string {
    if (!data?.deadlineTime) return '';
    const deadlineDate = new Date(`${data.deadlineDate}  ${data.deadlineTime}`);
    const deadlineTimezone = parseInt(data.timezone) * 60 * 60 * 1000;
    const userTimezone = new Date().getTimezoneOffset() * 60 * 1000;
    const deadlineAdjusted = deadlineDate.getTime() - deadlineTimezone - userTimezone;
    return moment(deadlineAdjusted).toISOString(true);
  }
}
