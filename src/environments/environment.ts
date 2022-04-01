export const environment = {
  production: false,
  type: 'DEV',

  BASE_URL_PUBLIC: 'https://erb9zgyyjg.execute-api.us-east-1.amazonaws.com/dev/v1/backoffice/api/cpg/001/country/',
  BASE_URL_INTERNAL: 'https://p0sjwxd7yl.execute-api.us-east-1.amazonaws.com/dev/v1/internal/api/cpg/001/country/',


  AWS_IDENTITY_POOL_ID: 'us-east-1:9d758390-3b08-4a4a-8c7d-cab54d08a82b',
  AWS_REGION: 'us-east-1',
  AWS_USER_POOL_ID: 'us-east-1_pf8nbnodd',
  AWS_CLIENT_ID: 'atuqlstrfjshvshufjgtl7i4b',
  AWS_OAUTH_DOMAIN: 'b2b-bo-dev.auth.us-east-1.amazoncognito.com',
  SIGN_IN_CALLBACK: 'http://localhost:4200/sign-in',
  SIGN_OUT_URL: 'https://d31xi06e7z6vg0.cloudfront.net/',

  AES_KEY: 'dSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x/A%D*G-',

  GTM_ID: 'GTM-W6TG6DB',
  TYC_S3_HOST: 'https://b2b-bo-frontend-dev.s3.amazonaws.com/',
  B2B_BO_BANNER_CLIENT_S3_HOST: 'B2B_backoffice_assign_banner_clients_csv.csv',
  B2B_LOAD_DATA_S3_HOST: 'b2b-xtract-cl-dev',
  KEYWORDS_ES_S3_HOST: 'b2b-elasticsearch-packages-dev',
  PRODUCT_IMAGES_S3_HOST: 'b2b-product-images-dev',
  BANNER_IMAGES_S3_HOST: 'b2b-frontend-banners-dev'


};
