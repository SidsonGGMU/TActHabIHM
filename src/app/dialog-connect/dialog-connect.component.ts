import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {TacthabService} from '../tacthab.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-connect',
  templateUrl: './dialog-connect.component.html',
  styleUrls: ['./dialog-connect.component.css']
})
export class DialogConnectComponent implements OnInit {

  constructor(private tservice: TacthabService,
              private translate: TranslateService,
              private dialogRef: MatDialogRef<DialogConnectComponent>) { }

  ngOnInit() {
  }


  getServerAdressPlaceholder(): Observable<string> {
    return this.translate.get("connectPlaceholder" );
  }

  getServerAdress(): string {
    return this.tservice.getServerURL();
  }

  setServerAdress(url: string) {
    // console.log("connect to", url);
    this.close();
    this.tservice.connect(url);
  }

  close() {
    this.dialogRef.close();
  }
}
