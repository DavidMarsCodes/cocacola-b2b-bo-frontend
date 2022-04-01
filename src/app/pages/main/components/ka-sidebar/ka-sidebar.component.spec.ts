import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSidebarComponent } from './ka-sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('KaSidebarComponent', () => {
  let component: KaSidebarComponent;
  let fixture: ComponentFixture<KaSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule],
      declarations: [KaSidebarComponent],
      providers: [
        provideMockStore({})
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
