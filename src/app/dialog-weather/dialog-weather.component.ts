import { Component, OnInit } from '@angular/core';
import {TacthabService} from '../tacthab.service';
import {DialogConnectComponent} from '../dialog-connect/dialog-connect.component';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';
import {BrickJSON} from '../data/Brick';


@Component({
  selector: 'app-dialog-weather',
  templateUrl: './dialog-weather.component.html',
  styleUrls: ['./dialog-weather.component.scss']
})
export class DialogWeatherComponent implements OnInit {
  setPosition: any;
  constructor(private tservice: TacthabService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<DialogConnectComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  getWeatherLabel(): Observable<string> {
    return this.translate.get("BrickWeather", {
      count: 2
    });
  }

  createWeather(CITY: string) {
    this.tservice.call({
      brickId: "WeatherFactory",
      method: "createWeather",
      arguments: [CITY]
    });
    this.close();
  }

  getExistingWeather(): BrickJSON[] {
    return this.tservice.getBricks().filter(B => B.types.indexOf("BrickWeather") >= 0 );
  }
}
