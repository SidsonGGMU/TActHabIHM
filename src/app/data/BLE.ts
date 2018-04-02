import {BrickJSON} from './Brick';

export interface BLECharacteristic {
  name: string;
  uuid: string;
  type: string;
  properties: string[];
}

export interface BLEService {
  name: string;
  uuid: string;
  type: string;
  characteristics: BLECharacteristic[];
}

export interface BLEDeviceDescription {
  name: string;
  uuid: string;
  isConnected: boolean;
  deviceType: string;
  state: {[key: string]: any};
  services?: BLEService[];
  characteristics?: BLECharacteristic[];
}

export interface BridgeState {
  state: {
    isOn: boolean;
    scanning: boolean;
    err: string;
  };
  devices: BLEDeviceDescription[];
}

export type GYROMEASURE = {
  alpha: number;
  beta: number;
  gamma: number;
};

export type ACCELERATION = {
  x: number;
  y: number;
  z: number;
};

export interface BLEJSON extends BrickJSON {
  BLE: BLEDeviceDescription;
}

export interface MetawearDescription extends BLEDeviceDescription {
  state: {
    buttonPressed: boolean;
    acc: ACCELERATION;
    gyr: GYROMEASURE;
  };
}

export interface MetawearJSON extends BLEJSON {
  BLE: MetawearDescription;
}
