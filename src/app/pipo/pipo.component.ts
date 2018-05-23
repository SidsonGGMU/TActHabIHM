import {Component, Input, OnInit} from '@angular/core';
import {BrickJSON} from '../data/Brick';
import {TacthabService} from '../tacthab.service';

interface PipoJSON extends BrickJSON {
  emitter1: number;
  channel1: number;
}

@Component({
  selector: 'app-pipo',
  templateUrl: './pipo.component.html',
  styleUrls: ['./pipo.component.scss']
})
export class PipoComponent implements OnInit {
  @Input() data: PipoJSON;
  @Input() update: number;

  constructor(private tservice: TacthabService) { }

  ngOnInit() {
  }

  setChannel1(v: number) {
    this.tservice.call({
      brickId: this.data.id,
      method: "setChannel1",
      arguments: [v]
    });
  }

  setEmitter1(v: number) {
    this.tservice.call({
      brickId: this.data.id,
      method: "setEmitter1",
      arguments: [v]
    });
  }

}
