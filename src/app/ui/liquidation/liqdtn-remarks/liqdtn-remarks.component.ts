import {Component, ElementRef, ViewChild} from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
  selector: 'app-liqdtn-remarks',
  templateUrl: './liqdtn-remarks.component.html',
  styleUrls: ['./liqdtn-remarks.component.css']
})
export class LiqdtnRemarksComponent implements ICellRendererAngularComp {
  @ViewChild('content') input !: ElementRef;
  thecontents = {something: ''};
  remarks: string = '';
  params: any;
  fifoId: any;

  isDisabled: boolean = false;
  cardAction: any;

  agInit(params: any): void {
    this.params = params
    this.fifoId = params.data.fifoReportId

    if(params.data.liqdtnRemark != null || params.data.liqdtnRemark != ''){
      this.remarks = params.data.liqdtnRemark
    }

    this.cardAction = params.data.cardAction

    //setting remarks for already submitted requests
    if(this.remarks != null){
      setTimeout(()=> {
        this.input.nativeElement.value = this.remarks
      }, 1)
    }
  }


  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  dosomething(data: any) {
    this.remarks = this.input.nativeElement.value.trim()
    this.params.callbackRemarks(this.remarks,this.fifoId);
  }
}
