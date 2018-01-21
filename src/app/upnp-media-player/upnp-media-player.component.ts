import {Component, Input, OnInit} from '@angular/core';
import {BrickUPnPJSON, CALL, CALL_RESULT, UPnP_item} from '../data/Brick';
import {TacthabService} from '../tacthab.service';
import {ServiceJSON} from 'alx-upnp';
import {StateVariableJSON} from 'alx-upnp/build/Service';
import {MatDialog, MatSliderChange} from '@angular/material';
import {UPnP_MEDIA_PATH, UpnpMediaExplorerComponent} from '../upnp-media-explorer/upnp-media-explorer.component';

@Component({
  selector: 'app-upnp-media-player',
  templateUrl: './upnp-media-player.component.html',
  styleUrls: ['./upnp-media-player.component.scss']
})
export class UpnpMediaPlayerComponent implements OnInit {
  @Input() mp: BrickUPnPJSON;
  @Input() update: number;

  constructor(private tservice: TacthabService, private dialog: MatDialog) { }

  ngOnInit() {
  }

  getName(): string {
    return this.mp.name;
  }

  getVolume(): number {
    return parseInt( this.getStateVariableByName("urn:upnp-org:serviceId:RenderingControl", "Volume").value, 10 );
  }

  setVolume(volume: MatSliderChange) {
    const call: CALL_VOLUME = {
      brickId: this.mp.id,
      method: "setVolume",
      arguments: [volume.value]
    };
    this.call( call );
  }

  isPlaying(): boolean {
    // STOPPED, PAUSED_PLAYBACK, PLAYING, TRANSITIONING, NO_MEDIA_PRESENT
    return this.getStateVariableByName("urn:upnp-org:serviceId:AVTransport", "TransportState").value === "PLAYING";
  }

  play(): Promise<CALL_RESULT> {
    return this.callPPS("play");
  }

  pause(): Promise<CALL_RESULT> {
    return this.callPPS("pause");
  }

  stop(): Promise<CALL_RESULT> {
    return this.callPPS("stop");
  }

  load() { // Open a media explorer
    const dialogRef = this.dialog.open(UpnpMediaExplorerComponent, {
      height: '95%',
      width: '95%',
    });
    dialogRef.afterClosed().subscribe( (res: UPnP_MEDIA_PATH) => {
      console.log("afterClosed =>", res);
      if (res && res.item) {
        this.loadMedia(res.MS.id, res.item.id).then(
          () => this.play(),
          err => console.error(err)
        );
      }
    });
  }

  loadMedia(mediaServerId: string, itemId: string): Promise<CALL_RESULT> {
    return this.call({
      brickId: this.mp.id,
      method: "loadMedia",
      arguments: [mediaServerId, itemId]
    });
  }

  loadURI(uri: string, metadata: UPnP_item): Promise<CALL_RESULT> {
    return this.call({
      brickId: this.mp.id,
      method: "loadURI",
      arguments: [uri, metadata]
    });
  }

  callPPS(method: "play" | "pause" | "stop"): Promise<CALL_RESULT> {
    const call: CALL_PPS = {
      brickId: this.mp.id,
      method,
      arguments: []
    };
    return this.call( call );
  }

  call(c: CALL): Promise<CALL_RESULT> {
    return this.tservice.call( c );
  }

  getServiceById(id: string): ServiceJSON {
    return this.mp.deviceUPnP.services.find( S => S.serviceId === id );
  }

  getStateVariableByName(idService: string, varName: string): StateVariableJSON {
    const service = this.getServiceById(idService);
    return service ? service.stateVariables.find( V => V.name === varName ) : undefined;
  }
}

type MP_EVENT = {
  brickId: string,
  serviceId: string,
  stateVariable: string,
  value: any
};

type CALL_VOLUME = {
  brickId: string,
  method: "setVolume",
  arguments: [number]
};

type CALL_PPS = {
  brickId: string,
  method: "play" | "pause" | "stop",
  arguments: any[]
};
