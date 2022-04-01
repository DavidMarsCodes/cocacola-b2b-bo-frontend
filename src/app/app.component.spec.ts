import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent
   
      ],
      providers: [
        provideMockStore({})
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'cocacola-andina'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cocacola-andina');
  });

});
