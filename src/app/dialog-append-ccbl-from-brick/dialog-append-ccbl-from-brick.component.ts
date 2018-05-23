import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TacthabService} from '../tacthab.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {CcblRootComponent} from '../ccbl-root/ccbl-root.component';
import {BrickJSON} from '../data/Brick';
import {FormControl, Validators} from '@angular/forms';
import {ValidationErrors} from '@angular/forms/src/directives/validators';
import {AbstractControl} from '@angular/forms/src/model';
import * as mathjs from "mathjs";
import {BrickCcblRootJSON} from '../brickTypes';

@Component({
  selector: 'app-dialog-append-ccbl-from-brick',
  templateUrl: './dialog-append-ccbl-from-brick.component.html',
  styleUrls: ['./dialog-append-ccbl-from-brick.component.scss']
})
export class DialogAppendCcblFromBrickComponent implements OnInit {
  private ccblType: CcblType;
  private selectedElement: any;
  private selectedBrick: BrickJSON;

  private brickFilter: (brick: BrickJSON) => boolean;

  public ccblName = "";
  public ccblInitialValue = "";

  ccblNameFormControl = new FormControl('', [
    Validators.required,
    // Validators.pattern(RE_alphanum),
    (c: AbstractControl): ValidationErrors | null => {
      const valid = this.isCcblNameValid() && !this.nameAlreadyExist();
      if (valid) {
        return null;
      } else {
        return {error: "not a valid mathjs symbol"} as ValidationErrors;
      }
    }
  ]);

  constructor(
    private tservice: TacthabService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<CcblRootComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfig
  ) {
    switch (data.ccblType) {
      case "event":
        this.brickFilter = b => false;
        break;
      case "emitter":
        this.brickFilter = b => b.emitters.length > 0 || b.channels.length > 0;
        break;
      case "channel":
        this.brickFilter = b => b.channels.length > 0;
        break;
    }

    this.ccblNameFormControl.registerOnChange(() => {
      console.log("Changement...");
    });

  }

  ngOnInit() {
  }

  ok() {
    this.dialogRef.close( {
      brick: this.selectedBrick,
      element: this.selectedElement,
      ccblName: this.ccblName
    } );
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

  getBricks(): BrickJSON[] {
    return this.tservice.getBricks().filter(this.brickFilter);
  }

  getElements(brick: BrickJSON) {
    const res = [];
    switch (this.data.ccblType) {
      case "event":
        return [];
      case "emitter":
        return [...brick.emitters, ...brick.channels];
      case "channel":
        return brick.channels;
    }
  }

  select(brick: BrickJSON, element: any) {
    this.selectedBrick   = brick;
    this.selectedElement = element;
  }

  isSelected(element): boolean {
    return this.selectedElement === element;
  }

  somethingSelected(): boolean {
    return this.selectedElement !== undefined;
  }

  isCcblNameValid(): boolean {
    try {
      const E = mathjs.parse(this.ccblName);
      return E.isSymbolNode;
    } catch (err) {
      return false;
    }
  }

  nameAlreadyExist(): boolean {
    const elements = [...this.data.root.env.channels, ...this.data.root.env.emitters, ...this.data.root.env.events];
    const names: string[] = elements.reduce( (L, c) => {
      L.push( c.ccbl.name );
      return L;
    }, [] as string[]);

    return names.indexOf( this.ccblName ) >= 0;
  }

}


type CcblType = "emitter" | "channel" | "event";
type DialogConfig = {
  ccblType: CcblType;
  root: BrickCcblRootJSON;
};
