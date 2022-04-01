export interface BERespErrorModel {
  httpStatus: number;
  ok: boolean;
  code: number;
  errorType: string;
  message: string;
}
