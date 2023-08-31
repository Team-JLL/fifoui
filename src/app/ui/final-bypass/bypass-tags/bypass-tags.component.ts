import { Component } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-bypass-tags',
  templateUrl: './bypass-tags.component.html',
  styleUrls: ['./bypass-tags.component.css']
})
export class BypassTagsComponent implements ICellRendererAngularComp {


  bypassFlag: any;
  params: any;
  showBYTag: any = false;
  showLQTag: any = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {}

  agInit(params: any): void {
    this.params = params;
    this.bypassFlag = params.data.bypassFlag

    if(this.bypassFlag == 'BY'){
      this.showBYTag = true
    }if (this.bypassFlag == 'LQ'){
      this.showLQTag = true
    }
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

}
