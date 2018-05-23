import {Component, Input, OnInit} from '@angular/core';
import {ACCELERATION, GYROMEASURE, MetawearJSON} from '../data/BLE';
import {TacthabService} from '../tacthab.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-metawear',
  templateUrl: './metawear.component.html',
  styleUrls: ['./metawear.component.scss']
})
export class MetawearComponent implements OnInit {
  @Input("data") private metawear: MetawearJSON;
  @Input()       private update:  number;

  constructor(private tservice: TacthabService,
              private translate: TranslateService) { }

  ngOnInit() {
  }

  getName(): string {
    return this.metawear.name;
  }

  getMetawear(): MetawearJSON {
    return this.metawear;
  }

  getConnected(): boolean {
    return this.metawear.BLE.isConnected;
  }

  getButtonPressed(): boolean {
    return this.metawear.BLE.state.buttonPressed;
  }

  getAccelerometer(): ACCELERATION {
    return this.metawear.BLE.state.acc;
  }

  getGyroscope(): GYROMEASURE {
    return this.metawear.BLE.state.gyr;
  }

  connect() {
    this.tservice.call({
      brickId: this.metawear.id,
      method: "connect",
      arguments: []
    });
  }

  disconnect() {
    this.tservice.call({
      brickId: this.metawear.id,
      method: "startNotifying",
      arguments: []
    });
  }

  startNotifying(sensor: SENSOR) {
    this.tservice.call({
      brickId: this.metawear.id,
      method: "startNotifying",
      arguments: [sensor]
    });
  }

  stopNotifying(sensor: SENSOR) {
    this.tservice.call({
      brickId: this.metawear.id,
      method: "stopNotifying",
      arguments: [sensor]
    });
  }

}

export type SENSOR = "accelerometer" | "gyroscope";
