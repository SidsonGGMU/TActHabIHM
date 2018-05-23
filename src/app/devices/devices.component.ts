import { Component, OnInit } from '@angular/core';
import {BrickJSON, BrickUPnPJSON} from '../data/Brick';
import {TranslateService} from '@ngx-translate/core';
import {TacthabService} from '../tacthab.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  constructor(private tservice: TacthabService,
              private translate: TranslateService) { }

  ngOnInit() {
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

}
