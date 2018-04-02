import { Component } from '@angular/core';
import {TacthabService} from './tacthab.service';
import 'hammerjs';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {translationsTitle} from "./translations/translationInterface";
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DialogConnectComponent} from './dialog-connect/dialog-connect.component';
import {BrickJSON, BrickUPnPJSON} from './data/Brick';
import {DialogBridgeBleComponent} from './dialog-bridge-blecomponent/dialog-bridge-ble.component';

const tacthab2ConfigLanguage = "tacthab2ConfigLanguage";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TActHab 2';
  private T;
  private obsUserName: Observable<string>;

  constructor( private tservice: TacthabService,
               private translate: TranslateService,
               private iconReg: MatIconRegistry,
               private dialog: MatDialog) {
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

    this.obsUserName = this.tservice.getObsUser().map( u => u.name );
  }

  isConnected(): boolean {
    return this.tservice.isConnected();
  }

  getBLEBridgeLabel(): Observable<string> {
    return this.translate.get("BLEBridge", {
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

  getBricks(): BrickJSON[] {
    return this.tservice.getBricks();
  }

  getMediaPlayers(): BrickUPnPJSON[] {
    const bricksUPnP = this.getBricksTyped("BrickUPnP") as BrickUPnPJSON[];
    return bricksUPnP.filter( B => B.types.indexOf("MediaRenderer") >= 0 );
  }

  getHueLamps(): BrickJSON[] {
    return this.getBricksTyped("HueLamp");
  }

  getMetawears(): BrickJSON[] {
    return this.getBricksTyped("METAWEAR");
  }

  getBricksTyped(type: string): BrickJSON[] {
    return this.getBricks().filter(
      B => B.types.indexOf(type) >= 0
    );
  }

  createBLEBridge() {
    const dialogRef = this.dialog.open(DialogBridgeBleComponent, {
      width: '400px',
      height: '250px',
      data: {}
    });
  }

}
