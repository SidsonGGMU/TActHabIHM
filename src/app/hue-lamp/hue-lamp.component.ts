import {Component, Input, OnInit} from '@angular/core';
import {BrickJSON} from '../data/Brick';
import {TranslateService} from '@ngx-translate/core';
import {TacthabService} from '../tacthab.service';

@Component({
  selector: 'app-hue-lamp',
  templateUrl: './hue-lamp.component.html',
  styleUrls: ['./hue-lamp.component.scss']
})
export class HueLampComponent implements OnInit {
  @Input("data") private hueLamp: LAMP_JSON;
  @Input()       private update:  number;

  constructor(private tservice: TacthabService,
              private translate: TranslateService) {
    // ...
  }

  ngOnInit() {
  }

  getName(): string {
    return this.hueLamp.name;
  }

  getUpdate(): number {
    return this.update;
  }

  getColorHSB(): string {
    const {bri, sat, hue} = this.hueLamp.state;
    return `HSB = {H: ${hue}, S: ${sat}, B: ${bri}`;
  }

  isOn(): boolean {
    return this.hueLamp.state.on;
  }

  turnOnTo(v: boolean) {
    return this.tservice.call({
      brickId: this.hueLamp.id,
      method: "setState",
      arguments: [{
        on: v
      }]
    });
  }

  getColor(): string {
    const {bri, sat, hue} = this.hueLamp.state;
    const H = hue * 360 / 65536;
    const S = sat / 255;
    const L = bri / 255;

    const C = (1 - Math.abs(2 * L - 1)) * S;
    const X = C * (1 - Math.abs(H / 60 % 2 - 1));
    const m = L - C / 2;

    let Rp: number;
    let Gp: number;
    let Bp: number;

    if (H >= 0 && H < 60) {
      Rp = C;
      Gp = X;
      Bp = 0;
    }
    if (H >= 60 && H < 120) {
      Rp = X;
      Gp = C;
      Bp = 0;
    }
    if (H >= 120 && H < 180) {
      Rp = 0;
      Gp = C;
      Bp = X;
    }
    if (H >= 180 && H < 240) {
      Rp = 0;
      Gp = X;
      Bp = C;
    }
    if (H >= 240 && H < 300) {
      Rp = X;
      Gp = 0;
      Bp = C;
    }
    if (H >= 300 && H < 360) {
      Rp = C;
      Gp = 0;
      Bp = X;
    }

    const R = Math.round( (Rp + m) * 255 );
    const G = Math.round( (Gp + m) * 255 );
    const B = Math.round( (Bp + m) * 255 );

    return "#" + [R, G, B].map(v => v.toString(16).toUpperCase())
                          .map(str => str.length === 1 ? `0${str}` : str)
                          .join("");
  }

  setColor(color: string) {
    const R = parseInt(color.slice(1, 3), 16) / 255;
    const G = parseInt(color.slice(3, 5), 16) / 255;
    const B = parseInt(color.slice(5, 7), 16) / 255;

    const Cmax  = Math.max(R, G, B);
    const Cmin  = Math.min(R, G, B);
    const delta = Cmax - Cmin;

    let   H: number;
    let   S: number;
    const L: number = (Cmax + Cmin) / 2;

    if (delta === 0) {
      H = 0;
      S = 0;
    } else {
      if (Cmax === R) {
        H = 60 * (((G - B) / delta) % 6);
      }
      if (Cmax === G) {
        H = 60 * (((B - R) / delta) + 2);
      }
      if (Cmax === B) {
        H = 60 * (((R - G) / delta) + 4);
      }
      S = delta / (1 - Math.abs(2 * L - 1));
    }

    // HSV avec H en degré et S, V en %
    // console.log("setColor", event, "=>", {H, S, L});
    return this.tservice.call({
      brickId: this.hueLamp.id,
      method: "setState",
      arguments: [{
        on: true,
        bri: Math.round(L * 254),
        hue: Math.round(H * 65535 / 360),
        sat: Math.round(S * 254)
      }]
    });
  }
}

type LAMP_STATE = {
  on: boolean;
  bri: number; // 1 to 254
  hue: number; // 0 to 65535(red) 25500(green) 46920(blue)
  sat: number; // 0 to 254
  effect: string; // 'none',
  xy: [number, number]; // [ 0, 0 ],
  ct: number; // 0,
  alert: string; // 'none',
  colormode: "hs" | "xy"; // 'hs',
  reachable: boolean; // false
};

type LAMP_STATE_SETTER = {
  on?: boolean;
  bri?: number; // 1 to 254
  hue?: number; // 0 to 65535(red) 25500(green) 46920(blue)
  sat?: number; // 0 to 254
  xy?: [number, number];
  ct?: number;
  alert?: "none" | "select" | "lselect";
  effect?: "none" | "colorloop";
  transitiontime?: number; // in x100ms, default: 4
};

type LAMP_DESCRIPTION = {
  state: LAMP_STATE;
  type: string; // 'Extended color light',
  name: string; // 'MK1',
  modelid: string; // 'LCT001',
  manufacturername: string; // 'Philips',
  uniqueid: string; // '00:17:88:01:00:b2:27:3a-0b',
  swversion: string; // '66013452',
  pointsymbol: any; // voir [Object],
};

type LAMP_JSON = BrickJSON & LAMP_DESCRIPTION;
