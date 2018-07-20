import {Component} from '@angular/core';
import {TacthabService} from './tacthab.service';
import 'hammerjs';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {translationsTitle} from "./translations/translationInterface";
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DialogConnectComponent} from './dialog-connect/dialog-connect.component';
import {BrickJSON, BrickUPnPJSON} from './data/Brick';
import {DialogBridgeBleComponent} from './dialog-bridge-blecomponent/dialog-bridge-ble.component';
import {appRoutes} from './routes';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from "rxjs/operators";
import { DialogWeatherComponent } from './dialog-weather/dialog-weather.component';




const tacthab2ConfigLanguage = "tacthab2ConfigLanguage";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private title = 'TActHab 2';
  private T;
  private obsUserName: Observable<string>;

  constructor( private tservice: TacthabService,
               private translate: TranslateService,
               private iconReg: MatIconRegistry,
               private dialog: MatDialog,
               private route: ActivatedRoute,
               private router: Router
             ) {
    router.events.pipe(
      filter(e => e instanceof NavigationEnd))
      .forEach(e => this.title = route.root.firstChild.snapshot.routeConfig.path );

    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    translate.use(localStorage.getItem(tacthab2ConfigLanguage) || "en");

    const T = this.T = {
      en: {lang: "english"},
      fr: {lang: "français"}
    };
    for (const key in translationsTitle) {
      const languages = translationsTitle[key];
      for (const lang in languages) {
        T[lang][key] = languages[lang];
      }
    }
    console.log(T);
    for (const lang in T) {
      translate.setTranslation(lang, T[lang]);
    }

    iconReg.addSvgIcon("more_vert", "../assets/ic_more_vert_black_24px.svg");

    this.obsUserName = this.tservice.getObsUser().pipe(map( u => u.name ));
  }

  isConnected(): boolean {
    return this.tservice.isConnected();
  }

  getBLEBridgeLabel(): Observable<string> {
    return this.translate.get("BLEBridge", {
      count: 2
    });
  }

  getWeatherLabel(): Observable<string> {
    return this.translate.get("BrickWeather", {
      count: 2
    });
  }

  getLanguageFullName(lang: string): string {
    return this.T[lang] ? this.T[lang].lang : lang;
  }

  getLanguages(): string[] {
    return Object.keys( this.T );
  }

  setLanguage(lang: string) {
    if (Object.keys(this.T).indexOf(lang) >= 0) {
      this.translate.use(lang);
      localStorage.setItem(tacthab2ConfigLanguage, lang);
    }
  }

  logout() {
    this.tservice.logout();
  }

  openConnect() {
    const dialogRef = this.dialog.open(DialogConnectComponent, {
      width: '400px',
      height: '250px',
      data: {}
    });

    /*dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });*/
  }

  getUserGender(): "male" | "female" {
    return this.isConnected() ? this.tservice.getUser().gender : undefined;
  }

  getUserName(): string {
    return this.isConnected() ? this.tservice.getUser().name : "";
  }

  getUserImageURL(): string {
    return this.isConnected() ? this.tservice.getUser().photos[0] : "";
  }

  getStrConnected(): Observable<string> {
    return this.translate.get("logged", { gender: this.getUserGender(), count: 1, logged: this.isConnected() });
  }

  createBLEBridge() {
    const dialogRef = this.dialog.open(DialogBridgeBleComponent, {
      width: '400px',
      height: '250px',
      data: {}
    });
  }


  createWeather() {
    const dialogRef = this.dialog.open(DialogWeatherComponent, {
      width: '400px',
      height: '250px',
      data: {}
    });
  }

  getPages(): string[] {
    return appRoutes
      .filter( R => R.path !== '' )
      .map( R => R.path );
      // .map( str => this.translate.get(str) );
  }

  getPageLabel(): Observable<string> {
    // console.log("this.route.root.path:", this.route.root);
    // return this.translate.get( this.route.root.path );
    // console.log( this.route.pathFromRoot[0] );
    return this.translate.get( this.title );
  }

}
