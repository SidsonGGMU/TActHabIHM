import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {TacthabService} from '../tacthab.service';
import {Observable} from 'rxjs/Observable';
import {BrickUPnPJSON, BrowsDirectChildrenResult, BrowseFlag, UPnP_container, UPnP_item} from '../data/Brick';

@Component({
  selector: 'app-upnp-media-explorer',
  templateUrl: './upnp-media-explorer.component.html',
  styleUrls: ['./upnp-media-explorer.component.scss']
})
export class UpnpMediaExplorerComponent implements OnInit {
  currentPath: UPnP_MEDIA_PATH = {
    MS: undefined,
    containers: [],
    item: undefined
  };
  currentContainers: UPnP_container[] = [];
  currentItems: UPnP_item[] = [];
  errorMessage: string = undefined;
  private processing = false;

  constructor(private tservice: TacthabService,
              private translate: TranslateService,
              public dialogRef: MatDialogRef<UpnpMediaExplorerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  ok() {
    this.dialogRef.close(this.currentPath);
  }

  cancel() {
    this.dialogRef.close();
  }

  getOKLabel(): Observable<string> {
    return this.translate.get("OK" );
  }

  getCancelLabel(): Observable<string> {
    return this.translate.get("CANCEL" );
  }

  gotoRoot() {
    this.currentPath.containers = [];
    this.currentPath.MS = undefined;
    this.currentContainers = [];
    this.currentItems = [];
  }

  async gotoMS(ms: BrickUPnPJSON) {
    this.currentPath.MS         = ms;
    this.currentPath.containers = [];
    this.currentPath.item       = undefined;
    this.currentContainers = [];
    this.currentItems      = [];
    this.errorMessage      = undefined;
    try {
      const P = this.tservice.call({
        brickId: ms.id,
        method: "Browse",
        arguments: ["0", "BrowseDirectChildren"] // itemId: string, flag: BrowseFlag
      });
      this.process(P);
      const res = await P;

      if (res.success) {
        const browseRes = res.success as BrowsDirectChildrenResult;
        this.currentContainers = browseRes.containers;
        this.currentItems      = browseRes.items;
      }
      if (res.error) {
        this.errorMessage = JSON.stringify( res.error );
      }
    } catch (err) {
      console.log("Error Browse on", ms, "at 0:", err);
      this.errorMessage = `Error Browse on", ms, "at 0: ${err.message}`;
    }
  }

  // Media Servers
  getMediaServers(): BrickUPnPJSON[] {
    return this.currentPath.MS ? [] : this.tservice.getBricks().filter(
      brick => brick.types.indexOf("MediaServer") >= 0
    ) as BrickUPnPJSON[];
  }

  getIconMS(ms: BrickUPnPJSON): string {
    if (ms.deviceUPnP.iconList.length) {
      const url = `${ms.deviceUPnP.baseURL}${ms.deviceUPnP.iconList[0].url}`; // .replace("//", "/");
      return url; // `http://${url}`;
    } else {
      return "/data/icons/osa_drive-harddisk.svg";
    }
  }

  getLabelMS(ms: BrickUPnPJSON): string {
    return ms.deviceUPnP.friendlyName;
  }

  // Containers
  async gotoContainer(ms: BrickUPnPJSON, container: UPnP_container) {
    this.currentPath.item = undefined;
    if (this.currentPath.MS !== ms) {
      this.currentPath.containers = [];
      this.currentPath.MS         = ms;
    }
    this.currentContainers = [];
    this.currentItems      = [];
    this.errorMessage      = undefined;
    let found = false;
    this.currentPath.containers = this.currentPath.containers.filter( c => {
      found = found || c === container;
      return !found;
    } );
    this.currentPath.containers.push(container);
    try {
      const P = this.tservice.call({
        brickId: ms.id,
        method: "Browse",
        arguments: [container.id, "BrowseDirectChildren"] // itemId: string, flag: BrowseFlag
      });
      this.process(P);
      const res = await P;
      if (res.success) {
        const browseRes = res.success as BrowsDirectChildrenResult;
        this.currentContainers = browseRes.containers;
        this.currentItems      = browseRes.items;
      }
      if (res.error) {
        this.errorMessage = JSON.stringify( res.error );
      }
    } catch (err) {
      console.log("Error Browse on", ms, "at ${container.id}:", err);
      this.errorMessage = `Error Browse on", ms, "at ${container.id}: ${err.message}`;
    }
  }

  getIconContainer(container: UPnP_container, defaultIcon = "/data/icons/folder_256.png"): string {
    if (container.albumArtURI) {
      const baseURL = this.currentPath.MS.deviceUPnP.baseURL;
      if (container.albumArtURI.indexOf(baseURL) === 0) {
        return container.albumArtURI;
      }
      return `${this.currentPath.MS.deviceUPnP.baseURL}${container.albumArtURI}`;
    } else {
      return defaultIcon;
    }
  }

  getLabelContainer(container: UPnP_container): string {
    return container.title || container.description;
  }

  // Items
  gotoItem(item: UPnP_item) {
    this.currentContainers = [];
    this.currentItems      = [];
    this.errorMessage      = undefined;
    this.currentPath.item  = item;
  }

  getIconItem(item: UPnP_item): string {
    return this.getIconContainer(item as any as UPnP_container, "/data/icons/media_icon.jpg");
  }

  getLabelItem(item: UPnP_item): string {
    return item.title || item.description;
  }

  isProcessing(): boolean {
    return this.processing;
  }
  private process(prom: Promise<any>) {
    this.processing = true;
    prom.then(
      () => this.processing = false,
      () => this.processing = false
    );
  }
}

export type UPnP_MEDIA_PATH = {
  MS: BrickUPnPJSON,
  containers: UPnP_container[];
  item: UPnP_item;
};
