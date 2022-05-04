import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() fullName : string | undefined;
  @Input() actionFormatted : string | undefined;
  @Input() message : string | undefined;
  @Input() time : string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
