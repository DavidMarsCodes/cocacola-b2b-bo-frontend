import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CognitoService } from '../../core/services/cognito.service';
import { KeyWordsComponent } from './keywords.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { KeyWord } from 'src/app/core/models/keyword.model';
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

const file = `limonada, jugo
ades, leche, soja, soya, hades`

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
  buchanan´s, buchanas, buchannans, bachanans, buchana's, whisky, whiskie, guisky
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





const spaceRegex = /(\r\n|\n|\r)/gm;

describe('KeyWordsComponent', () => {
  let component: KeyWordsComponent;
  let fixture: ComponentFixture<KeyWordsComponent>;
  let spyCognitoService: jasmine.SpyObj<CognitoService>;


  beforeEach(async () => {
    spyCognitoService = jasmine.createSpyObj<CognitoService>('CognitoService', ['readFileBlobInBucket']);
    spyCognitoService.readFileBlobInBucket.and.returnValue(Promise.resolve(validResponse));

    await TestBed.configureTestingModule({
      declarations: [KeyWordsComponent],
      imports: [MatMenuModule,ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: CognitoService, useValue: spyCognitoService }

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show read File Blob InBucket ', () => {
     spyCognitoService.readFileBlobInBucket('product_synonyms_'+valueFile.cpgId+'_'+valueFile.countryCode+'_'+valueFile.organizationId+'_es.txt').then(
      async (resp) => {
      expect(resp.data).toBe(validResponse.data);
      
   });
  });

  


});
