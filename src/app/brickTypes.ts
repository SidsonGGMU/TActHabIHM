import {ChannelJSON} from 'ccbl-js/ChannelInterface';
import {CCBLEmitterValueJSON} from 'ccbl-js/EmitterValueInterface';
import {CCBL_EventJSON} from 'ccbl-js/EventInterface';
import {BrickJSON} from './data/Brick';

export type BrickCcblRootJSON_event = {
  brick: {
    id: string;
    eventerName: string;
  };
  ccbl: {
    name: string;
    value: any;
    description: CCBL_EventJSON
  };
};

export type BrickCcblRootJSON_emitter = {
  brick: {
    id: string;
    emitterName: string;
  };
  ccbl: {
    name: string;
    value: any;
    description: CCBLEmitterValueJSON
  };
};

export type BrickCcblRootJSON_channel = {
  brick: {
    id: string;
    channelName: string;
  };
  ccbl: {
    name: string;
    value: any;
    initialValue: any;
    description: ChannelJSON;
  };
};


export interface BrickCcblRootJSON extends BrickJSON {
  env: {
    events:   BrickCcblRootJSON_event  [];
    emitters: BrickCcblRootJSON_emitter[];
    channels: BrickCcblRootJSON_channel[];
  };
}
