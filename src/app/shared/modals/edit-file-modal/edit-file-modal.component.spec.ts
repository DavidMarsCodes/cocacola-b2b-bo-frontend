import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CognitoService } from '../../../core/services/cognito.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { EditFileModalComponent } from './edit-file-modal.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

const initialState = {
  userLocal: {
    geoCountryCode: 'CL',
  },
  user: {
    countryId: 'CL',
    jwt: 'jdskfsdjklafncjkljeñoMSDKÑSLNCVJKDSNV',
    email: 'asd@asd.com'
  },
};

const valueFile = { 
  cpgId: '001',
  countryCode: 'CL',
  organizationId: '3043'
}



const validResponse = {

  data: [
    `limonada, jugo
  ades, leche, soja, soya, hades
  gloe, aloe, vera
  alto, carmen, pisco, piscola
  andifrut, andina, fruta, jugo, colacion
  valle, jugo, vaye, balle, baye
  aquarius, aquarus, aquarious, aguarios, aguarious, acuarius
  artesanos, cochiguaz, cochiquas, pisco
  baileys, licor, irlandes, irish, cream, bailys, beilys, beileys, beilis, bailis, balyes, bailyes
  bells, whisky, bell, vells, bels, whiskie
  benecdictino, beneditino, benidictino, agua, venedictino, benediktino, binedectino
  blak, cafe, blak, black, blac
  brahma, brama, bhrama, cerveza, brahama, chela
  brujas, salamanca, pisco, licor, salamanka
  buchanans, buchanas, buchannans, bachanans, buchana's, whisky, whiskie, guisky
  budwaiser, budweiser, budwaser, cerveza, badweiser, budweser, badweser
  bulleit, bourdon, bulit, borbon, bullit, burbon, bullet, burbaun, bulliet, barboun, bulleit, borboun, bulleit bourban, buleit, whisky, whiskie, guisky
  cacique, cacike, ron, casique, casike, caciqe, run, rum, rom
  capel, pisco, kapel, cappel, kappel
  ciroc, cirok, vodka, ziroc, siroc
  coca-cola, cocacola, coke, coka, pepsi
  corona, cerveza, korona, lager, extra, chela
  ctar, catar, cetar
  cusqueña, cuaqueña, cusquena, cerveza, chela
  valle, andina, nectar, jugo, adv
  dogadan, te, verde, jengibre, limon, hierva, especias, negro
  don, julio, tequila, tekila, donjulio
  fanta, naranja
  fuze, tea, te, fuse
  gold, peak, tea, te, hierva
  grand, old, parr, whiskie, whisky, whiskie
  grosso, groso, vino
  guallarauco, jugo, natural, frutas, huallarauco
  guiness, guines, cerveza
  hacienda, torre, hacienda, pisco
  imperial, cerveza, chela
  inca, oro, inka, pisco
  inca, kola, cola, inka
  j&b, jyb, whiskie, whisky
  johnnie, walker, johnny, woker, wolker, whiskie, whisky, johnnie, etiqueta, negra, roja, azul, verde
  kapo, capo, piña, pina, frambuesa, naranja, manzana
  maddero, madero, medero, ron, rum, run, rom
  monster, energetica, monter, redbull
  monte, fraile, frayle
  myla, mila, espumante
  nectar, jugo
  nola, pisco
  nordic, mist, ginger, nordic, ale
  pampero, ron, run, rom, rum
  pkdor, pecador
  powerade, isotonica, deportiva
  prologo, vino
  rani, jugo, nectar
  sandy, mac, sandi, whiskie, whisky, whiski, scotch
  sensus, espumante, brut
  sheridans, licor, crema, cream
  singleton, licor, cingleton, whiski, whiskie, whisky, dufftown, duftown, duftom, dufftom
  smartwater, agua, mineral, glaceau, nubes, embotellada
  smirnoff, smirnof, esmirnoff, vodka, ruso
  sprite, sprait, esprait, esprite
  stella, artois, stela, artuas, cerveza, chela
  tanqueray, tankeray, tanquerai, tankerai, gin, ginebra
  topo,chico,agua,mineral, gazzzzz
  andifrut, andina, fruta, individual, colacion, valle, jugo, vaye, balle, baye, nectar, jugo, adv
  royal, bliss, blis
  vat, 69, escoces
  pineapple, anana, piña, pina
  peach, durazno, durasno
  apple, manzana, mansana
  orange,naranja,fanta`
  ]
} as any;


const validateTraspaseData = {
    fileEdit: new Blob([validResponse.data], {type: "text/plain", endings: 'native'}),
    action: 'editOne',
    element: {
      title: 'bebitas',
      keywords: ['hola', 'hola2', 'hola3']
    }
} as any; 


describe('EditFileModalComponent', () => {
  let component: EditFileModalComponent;
  let fixture: ComponentFixture<EditFileModalComponent>;
  let spyCognitoService: jasmine.SpyObj<CognitoService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFileModalComponent],
      imports: [MatMenuModule,ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: CognitoService, useValue: spyCognitoService }
        ,
          NgbActiveModal,
          NgbModal
      
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFileModalComponent);
    component = fixture.componentInstance;
    component.data = validateTraspaseData;
    fixture.detectChanges();
    
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('line breack', () => {
    expect(component).toBeTruthy();
    expect(component.linebBreak('1', '2', '3,4,5', '7,8')).toEqual('3,4,57,8\r\n');
  });

  it('sendFileS3', async () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    fixture.detectChanges();
    component.file = new Blob([validResponse.data], {type: "text/plain", endings: 'native'});
    await expectAsync(component.sendFileS3('')).toBeResolved({})
 });

 it('deleteMasiveFile',  async () => {
   expect(component).toBeTruthy();
   component.ngOnInit();
   fixture.detectChanges();
   component.file = new Blob([validResponse.data], {type: "text/plain", endings: 'native'});
    expect(component.deleteMasiveFile).toHaveBeenCalled;
})

it('updateMasiveFile',  async () => {
  expect(component).toBeTruthy();
  component.ngOnInit();
  fixture.detectChanges();
  component.file = new Blob([validResponse.data], {type: "text/plain", endings: 'native'});
   expect(component.updateMasiveFile).toHaveBeenCalled;
})

fit('addNewfile',  async () => {
  expect(component).toBeTruthy();
  component.ngOnInit();
  fixture.detectChanges();
  component.file = new Blob([validResponse.data], {type: "text/plain", endings: 'native'});
   expect(component.addNewfile).toHaveBeenCalled;
})

});


