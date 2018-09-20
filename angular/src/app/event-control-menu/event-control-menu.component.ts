import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CreateNewEventComponent } from '../create-new-event/create-new-event.component';
import { MobileDetectorService } from '../mobile-detector.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'event-control-menu',
  templateUrl: './event-control-menu.component.html',
  styleUrls: ['./event-control-menu.component.css']
})
export class EventControlMenuComponent implements OnInit {

  animal: string;
  name: string;

  dialogWidth = "1100px";
  dialogHeight = "800px";

  constructor(public dialog: MatDialog, private mds: MobileDetectorService) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateNewEventComponent, {
      width: this.dialogWidth,
      height: this.dialogHeight,
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}