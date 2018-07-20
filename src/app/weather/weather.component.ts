import { Component, Input, OnInit } from '@angular/core';
import {WeatherJSON, TacthabService} from '../tacthab.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  @Input("data") weatherCity: WeatherJSON;
  @Input() update: number;
  weatherIcon: any;
  constructor(private tservice: TacthabService,
    private translate: TranslateService) { }

  ngOnInit() { }

  getName(): string {
    return this.weatherCity.name;
  }

  deleteWeather() {
    this.tservice.call({
      brickId: "WeatherFactory",
      method: "deleteWeather",
      arguments: [this.weatherCity.id]
    });
  }
}
