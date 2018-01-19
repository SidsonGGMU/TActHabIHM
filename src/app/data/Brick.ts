import {DeviceJSON} from "alx-upnp";

export type BRICK_ID = string;

export interface BrickJSON {
  id: BRICK_ID;
  name: string;
  types: string[];
  update: number;
}

export interface BrickUPnPJSON extends BrickJSON {
  deviceUPnP: DeviceJSON;
}

export type CALL = {
  brickId: string;
  method: string;
  arguments: any[];
};

export type CALL_RESULT = {
  success?: any;
  error?: any;
};

export enum BrowseFlag {
  BrowseMetadata      = "BrowseMetadata",
  BrowseDirectChildren= "BrowseDirectChildren"
}

export type BrowseMetaDataResult = UPnP_container | UPnP_item;
export type BrowsDirectChildrenResult = {containers: UPnP_container[], items: UPnP_item[]};
export type BrowseResult = BrowseMetaDataResult | BrowsDirectChildrenResult;

export type UPnP_container = {
  id: string;
  parentID: string;
  restricted: boolean;
  searchable: boolean;
  title: string;
  creator: string;
  date: string;
  publisher: string;
  genre: string[];
  episodeSeason: string;
  class: string;
  albumArtURI: string;
  description: string;
  longDescription: string;
  icon: string;
  seriesTitle: string;
};

export type UPnP_item = {
  id: string;
  parentID: string;
  restricted: boolean;
  title?: string;
  creator?: string;
  date?: string;
  publisher?: string;
  genre?: string[];
  episodeSeason?: string;
  class: string;
  albumArtURI?: string;
  description: string;
  longDescription: string;
  icon?: string;
  seriesTitle?: string;
  raw: string;
  res: {
    uri: string;
    duration: string;
    size: number;
    resolution: string;
    bitrate: number;
    nrAudioChannels: number;
    protocolInfo: string;
  };
};
