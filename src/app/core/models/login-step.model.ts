export interface LoginStep {
  stepName: string;
  title: string;
  previousStep?: string;
  inputType?: LoginInputTypes;
  stepNumber?: number;
  subtitle?: string;
  hasInput?: boolean;
  hasBackButton?: boolean;
  bodyButtons?: any[];
  footerButtons?: any[];
}

export enum LoginInputTypes {
  EMAIL = 'email',
  PHONE = 'phone',
  PASSWORD = 'password',
  CODE = 'code',
}
