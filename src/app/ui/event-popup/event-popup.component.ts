import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css']
})

export class EventPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    //this.bypassReqId = JSON.stringify(data.bypassReqId)
  }

  downloadEventLogReport(){
  }

}

