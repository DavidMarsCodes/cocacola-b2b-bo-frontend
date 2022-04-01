export const environment = {
  production: false,
  type: 'STG',
  BASE_URL_PUBLIC: 'https://44mjr8wsd1.execute-api.us-east-1.amazonaws.com/stage/v1/backoffice/api/cpg/001/country/',
  BASE_URL_INTERNAL: 'https://44mjr8wsd1.execute-api.us-east-1.amazonaws.com/stage/v1/internal/api/cpg/001/country/',


  AWS_IDENTITY_POOL_ID: 'us-east-1:ab72ca9e-ffd6-45c6-8154-aee877fb30f8',
  AWS_REGION: 'us-east-1',
  AWS_USER_POOL_ID: 'us-east-1_PPMRp5Ezw',
  AWS_CLIENT_ID: '6kabgi5ks1ckcv7u47skddmuuo',
  AWS_OAUTH_DOMAIN: 'b2b-bo-stg.auth.us-east-1.amazoncognito.com',
  SIGN_IN_CALLBACK: 'https://d35jip56gt1si5.cloudfront.net/sign-in',
  SIGN_OUT_URL: 'https://d35jip56gt1si5.cloudfront.net/',

  AES_KEY: 'dSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x/A%D*G-',

  TYC_S3_HOST: 'https://b2b-bo-frontend-stage.s3.amazonaws.com/',
  B2B_BO_BANNER_CLIENT_S3_HOST: 'B2B_backoffice_assign_banner_clients_csv.csv',
  B2B_LOAD_DATA_S3_HOST: 'b2b-xtract-cl-stage',
  KEYWORDS_ES_S3_HOST: 'b2b-elasticsearch-packages-stage',
  PRODUCT_IMAGES_S3_HOST: 'b2b-product-images-stage',
  BANNER_IMAGES_S3_HOST: 'b2b-frontend-banners-stage'
};
