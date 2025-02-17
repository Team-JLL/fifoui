import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-upload-errors',
  templateUrl: './upload-errors.component.html',
  styleUrls: ['./upload-errors.component.css']
})
export class UploadErrorsComponent implements OnInit {
  source: any = {
    datatype: 'json',
    datafields: [
      { name: 'errMsg', type: 'string' },
      { name: 'errSuggestion', type: 'string' }
    ],
    id: 'index',
    localdata: null,
  };
  rowData: any[] = [];

  columns: any[] = [
    { headerName: 'Sl.No', field: 'index', sortable: true, filter: true, width:100,valueGetter: (node: any) => String(node.node.rowIndex + 1) },
    { headerName: 'Row No.', field: 'errSuggestion', sortable: true, filter: true,  width:250},
    { headerName: 'Error Message', field: 'errMsg', sortable: true, filter: true,  width:420}
  ];

  @Output() fileCleared: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UploadErrorsComponent>
  ) {}

  ngOnInit() {
    if (this.data?.errorData) {
      this.rowData = this.data.errorData;
    }
  }

  closeDialog() {
    this.fileCleared.emit(); // Emit the event to clear the file
    this.dialogRef.close(); // Close the modal dialog
  }
}
