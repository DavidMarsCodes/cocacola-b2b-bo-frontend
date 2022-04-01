export const environment = {
  production: false,
  type: 'TEST',

  BASE_URL_PUBLIC: '/test/v1/backoffice/api/cpg/001/country/',
  BASE_URL_INTERNAL: '/test/v1/internal/api/cpg/001/country/',

  AWS_IDENTITY_POOL_ID: 'us-west-0:xxxxxxx-xxxx-xxxx',
  AWS_REGION: 'us-west-0',
  AWS_USER_POOL_ID: 'us-west-0_123456789',
  AWS_CLIENT_ID: '1234564879123456789456123',
  AWS_OAUTH_DOMAIN: 'b2b-backoffice.auth.us-north-n.amazoncognito.com',
  SIGN_IN_CALLBACK: 'http://anyurl/sign-in',
  SIGN_OUT_URL: 'https:///anyurl/',

  AES_KEY: 'sdf21sdf1561DF3DS5fd6s3f2sdf156adss32ad1S32D1s5ad6',

  TYC_S3_HOST: 'https://frontend.s3.amazonaws.com/',
  B2B_LOAD_DATA_S3_HOST: 'any-xtract',

  KEYWORDS_ES_S3_HOST: 'b2b-elasticsearch-packages-test',
  PRODUCT_IMAGES_S3_HOST: 'any-product-images',
  BANNER_IMAGES_S3_HOST: 'any-frontend-banners'

};
