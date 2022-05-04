import { Component, OnInit, Input } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MsgBoxComponent } from '../msgContainer.component';

@Component({
  selector: 'app-image-files',
  templateUrl: './image-files.component.html',
  styleUrls: ['./image-files.component.css']
})
export class ImageFilesComponent implements OnInit {

  @Input() public image!: any
  public imgSource: string = '';

  constructor(
    public msgContainer: MsgBoxComponent
  ) { }

  ngOnInit(): void {
    let reader = new FileReader();
    var blob = new Blob ([this.image.data], {type: this.image.type!});
    reader.readAsDataURL(blob);
    // Function done when reader is done with encoding file to base64
    reader.onload = (events: any) => {
      this.imgSource = events.target.result;
    };
    window.setTimeout( this.msgContainer.scrollView, 200) //Waits 200 milliseconds(about time it takes to load message in container) then scroll to bottom
  }

}
