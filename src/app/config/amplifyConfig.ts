import { environment } from '../../environments/environment';

export default {
  Auth: {
    // Amplify.configure({
    //   Auth: {
    //     identityPoolId: environment.AWS_IDENTITY_POOL_ID,
    //     region: environment.AWS_REGION,
    //     userPoolId: environment.AWS_USER_POOL_ID,
    //     userPoolWebClientId: environment.AWS_CLIENT_ID,
    //     federationTarget: 'COGNITO_USER_POOLS',
    //     oauth: {
    //       domain: environment.AWS_OAUTH_DOMAIN,
    //       scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
    //       redirectSignIn: 'http://localhost:4200/main/home/',
    //       //redirectSignOut: 'https://d31xi06e7z6vg0.cloudfront.net/',
    //       responseType: 'code',
    //     },
    //   },
    //   Storage: {
    //     AWSS3: {
    //       bucket: environment.B2B_LOAD_DATA_S3_HOST,
    //       region: environment.AWS_REGION,
    //     }
    //   }
    // });
    identityPoolId: environment.AWS_IDENTITY_POOL_ID,
    region: environment.AWS_REGION,
    userPoolId: environment.AWS_USER_POOL_ID,
    userPoolWebClientId: environment.AWS_CLIENT_ID,
    oauth: {
      domain: environment.AWS_OAUTH_DOMAIN,
      scope: ['email', 'openid'],
      redirectSignIn: environment.SIGN_IN_CALLBACK,
      redirectSignOut: environment.SIGN_OUT_URL,
      responseType: 'code',
      options: {
        AdvancedSecurityDataCollectionFlag: true
      }
    },
  },
  Storage: {
    AWSS3: {
      bucket: environment.B2B_LOAD_DATA_S3_HOST,
      region: environment.AWS_REGION,
    }
  }
};
