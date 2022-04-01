import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Storage } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { from, Observable } from 'rxjs';
import * as UserActions from 'src/app/core/state/actions/user.actions';
import { EndpointsCodes } from '../enums/endpoints-codes.enum';
import { UserInfo } from '../models/user-info.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  readonly EndpointsCodes = EndpointsCodes;
  fileBlob: Blob;

  constructor(
    private store: Store<{ user: UserInfo }>
  ) {
  }

  checkUser(): Observable<any> {
    return new Observable<any>((obs) => {
      from(Auth.currentAuthenticatedUser()).subscribe(
        (currentUser) => {
          obs.next(currentUser);
        },
        (error) => obs.error(error)
      );
    });
  }

  signInAws(): any {
    Auth.federatedSignIn();
  }

  setBlobToBucket(blob: Blob, name: string) {
    const customPrefix = { public: '' };
    const upload = Storage.put(name, blob, {
      bucket:  environment.KEYWORDS_ES_S3_HOST,
      customPrefix: customPrefix,
      contentType: 'text/plain',
      completeCallback: (event) => {
        console.log(`Successfully uploaded ${event.key}`);
       },
      progressCallback: (progress) => {
        
      },
      errorCallback: (err) => {
        console.error('Unexpected error while uploading', err);
      }
    });
    
  }


  setFileToBucket(file: File, name: string): any {
    const storageOptions = {
      bucket: environment.B2B_LOAD_DATA_S3_HOST,
      customPrefix: { public: '' },
      resumable: true,
      contentType: 'text/csv',
      progressCallback: (progress) => {
        return progress.loaded;
      },
    };
    const upload = Storage.put(name, file, storageOptions);
    return upload;
  }

  readFileBlobInBucket(bucket: string, name: string): Promise<any> {
    const storageOptions = {
      bucket: bucket,
      customPrefix: { public: '' },
      download: true,
      track: true,
      expires: 0,
      provider: 'AWSS3',
      size: '100'
    };

    var promise = new Promise(function (resolve, reject) {
      Storage.get(name, storageOptions).then(
        (data) => {
          const newBlob: Blob = new Blob([data.Body], { type: 'application/json' });
          newBlob.text().then(
            async (resp) => {
              resolve(resp);
            });
        });
    });
    return promise;
  }

  getImageFromBucket(bucket: string, name: string, field: string): Promise<any> {
    const storageOptions = {
      bucket: bucket,
      customPrefix: { public: '' },
      download: false,
    };
    return Storage.get(field + '/' + name, storageOptions);
  }


  setImageToBucket(file: File, name: string, field: string): any {
    const storageOptions = {
      bucket: environment.PRODUCT_IMAGES_S3_HOST,
      customPrefix: { public: field + '/' },
    };
    Storage.put(name, file, storageOptions);
  }

  cancelUploadFile(upload): void {
    Storage.cancel(upload);
  }

  getSessionExpirationTime(): Observable<any> {
    return new Observable<any>((obs) => {
      from(Auth.currentSession()).subscribe(
        (currentSession) => {
          obs.next(currentSession.getAccessToken().getExpiration());
        },
        (error) => obs.error(error)
      );
    });
  }

  refreshUserSession(): Observable<any> {
    return new Observable<any>((obs) => {
      from(Auth.currentAuthenticatedUser()).subscribe(
        (cognitoUser) => {
          from(Auth.currentSession()).subscribe(
            (currentSession) => {
              cognitoUser.refreshSession(currentSession.getRefreshToken(), (err, refreshSession) => {
                this.store.dispatch(UserActions.loadJwt({ jwt: refreshSession.idToken.jwtToken }));
                obs.next();
              });
            },
            (error) => obs.error(error)
          );
        },
        (error) => obs.error(error)
      );
    });
  }

  signOut(): void {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

}
