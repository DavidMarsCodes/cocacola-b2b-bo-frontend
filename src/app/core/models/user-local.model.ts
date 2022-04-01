import { CountryCodes } from '../enums/country-codes.enum';

export interface UserLocal {
  geoCountryCode?: CountryCodes;
  organizationId?: string;
  cpgId?: string;
}
