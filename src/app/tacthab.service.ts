import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {Observable} from 'rxjs/Observable';
import {connect} from "socket.io-client";
import {PassportUser} from './data/passportUser';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {BrickJSON, BrickUPnPJSON, CALL_RESULT, UPnP_item} from './data/Brick';
import {CALL} from "./data/Brick";
import {ServiceJSON} from 'alx-upnp';
import {StateVariableJSON} from 'alx-upnp/build/Service';
import {BLEJSON} from './data/BLE';

@Injectable()
export class TacthabService {
  private subjUser = new BehaviorSubject<PassportUser>(undefined );
  private obsUser  = this.subjUser.asObservable();
  private obsIsConnected = this.obsUser.map( u => !!u );
  private sio: SocketIOClient.Socket;
  private url = `${location.protocol}//${location.host}`;
  private connected = false;
  private bricks: BrickJSON[];

  constructor(private http: HttpClient) {
    this.obsIsConnected.forEach( c => this.connected = c );
    this.connect();
    this.obsIsConnected.forEach( connected => {
      console.log("connected", connected);
      if (connected) {
        this.sio.emit(
          "getBricks",
            bricks => this.bricks = bricks.map( B => ({...B, update: 0}) )
        );
      } else {
        this.bricks = [];
      }
    });
  }

  logout() {
    const Flogout = () => this.sio.disconnect();
    this.http.get("/logout").subscribe(
      Flogout, Flogout, Flogout
    );
  }

  getBricks(): BrickJSON[] {
    return this.bricks;
  }

  getBricksTyped(type: string): BrickJSON[] {
    return this.bricks.filter( b => b.types.indexOf(type) >= 0 );
  }

  connect(url?: string) {
    this.url = url = url || this.url;
    if (this.sio) {
      this.sio.disconnect();
    }

    this.sio = connect(url);

    this.sio.on("Hello", data => {
      console.log("passport", data);
      this.subjUser.next(data.passportJSON);
    });

    this.sio.on("brickAppears", brickJSON => {
      console.log("brickAppears", brickJSON);
      brickJSON.update = 0;
      this.bricks = this.bricks.concat( [brickJSON] );
    });

    this.sio.on("brickDisappears", id => {
      console.log("brickDisappears", id);
      this.bricks = this.bricks.filter( B => B.id !== id );
    });

    this.sio.on("disconnect", () => {
      this.subjUser.next( undefined );
    });

    this.sio.on( "brickEvent", (evt: BrickEvent) => {
      this.unserializeEvent(evt);
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  getObsUser(): Observable<PassportUser> {
    return this.obsUser;
  }

  getUser(): PassportUser {
    return this.subjUser.getValue();
  }

  getServerURL(): string {
    return this.url;
  }

  call(C: CALL): Promise<CALL_RESULT> {
    return new Promise( (resolve, reject) => {
      if (this.isConnected()) {
        this.sio.emit( "call", C, result => {
          console.log(C, "result", result);
          resolve(result);
        } );
      } else {
        reject( {error: "NOT CONNECTED"});
      }
    });
  }

  subscribeToSocketIoEvent(name: string, cb: (data: any) => void) {
    if (this.sio) {
      this.sio.on(name, cb);
    }
  }

  unsubscribeToSocketFromEvent(name: string, cb: (data: any) => void) {
    if (this.sio) {
      this.sio.off(name, cb);
    }
  }

  getBrickFromId(id: string): BrickJSON {
    return this.bricks.find( B => B.id === id );
  }

  getServiceById(brick: BrickUPnPJSON, serviceId: string): ServiceJSON {
    return brick && brick.deviceUPnP ? brick.deviceUPnP.services.find( S => S.serviceId === serviceId ) : undefined;
  }

  getStateVariableByName(brick: BrickUPnPJSON, serviceId: string, varName: string): StateVariableJSON {
    const service = this.getServiceById(brick, serviceId);
    return service ? service.stateVariables.find( V => V.name === varName ) : undefined;
  }

  // XXX Unserialize brick events with respect to the type of the brick...
  unserializeEvent(event: BrickEvent) {
    const brick = this.getBrickFromId( event.brickId );
    if (brick) {
      const types = brick.types;
      for (let i = types.length - 1; i >= 0; i--) {
        const type = types[i];
        switch (type) {
          case "BLE":
            const brickBLE = brick as BLEJSON;
            this.unserializeBrickBLEEvent(brickBLE, event);
            return;
          case "BrickUPnP":
            const brickUPnP = brick as BrickUPnPJSON;
            this.unserializeBrickUPnPEvent(brickUPnP, event);
            return;
          case "Brick":
            this.unserializeBrickEvent(brick, event);
            return;
        }
      }
    }
  }

  unserializeBrickEvent(brickJSON: BrickJSON, event: BrickEvent) {
    console.log("Unserialize Brick event", event, "for brick", brickJSON);
    if (typeof brickJSON[event.attribute] === "object") {
      const L = event.data as [string, any][];
      if (L.forEach !== undefined) {
        L.forEach(([k, v]) => brickJSON[event.attribute][k] = v);
      } else {
        const obj: {[key: string]: any} = event.data as {[key: string]: any};
        for (const i in obj) {
          brickJSON[event.attribute][i] = obj[i];
        }
      }
    } else {
      // console.log(event.attribute, "<=", event.data);
      brickJSON[event.attribute] = event.data;
    }
    brickJSON.update++;
  }

  unserializeBrickUPnPEvent(brickUPnP: BrickUPnPJSON, event: BrickUPnPEvent) {
    // console.log("Unserialize UPnP event", event, "for brick", brickUPnP);
    const serviceId = event.attribute;
    const stateVarName = event.data.stateVariable;
    const stateVar = this.getStateVariableByName(brickUPnP, serviceId, stateVarName);
    if (stateVar) {
      stateVar.value = event.data.value;
      brickUPnP.update++;
    } else {
      brickUPnP[serviceId] = event.data;
      brickUPnP.update++;
    }
  }

  unserializeBrickBLEEvent(brickBLE: BLEJSON, event: BrickBLEEvent) {
    // console.log(brickBLE, "vent", event);
    switch (event.attribute) {
      case "updateIsConnected":
        brickBLE.BLE.isConnected = event.data as boolean;
        brickBLE.update++;
        break;
      case "updateState":
        brickBLE.BLE.state = {...brickBLE.BLE.state, ...event.data as JsonObject};
        brickBLE.update++;
        break;
      default:
        console.error("Unknown attribute", event.attribute, "for BrickBLE");
    }
  }

}


interface BrickEvent {
  brickId: string;
  attribute: string;
  data: any;
}

interface BrickUPnPEvent extends BrickEvent {
  data: {
    stateVariable: string;
    value: any;
  };
}

type JsonObject = {[key: string]: any};

interface BrickBLEEvent extends BrickEvent {
  attribute: string; // "updateIsConnected" | "updateState";
  data: boolean | JsonObject;
}

export interface MediaRendererJSON extends BrickUPnPJSON {
  upnpItem: UPnP_item;
}
