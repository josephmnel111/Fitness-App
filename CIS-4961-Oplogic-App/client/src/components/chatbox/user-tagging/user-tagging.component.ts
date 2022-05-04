import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/../../shared/models/Model';
import { ChatboxComponent } from '../chatbox.component';

@Component({
  selector: 'user-tagging',
  templateUrl: './user-tagging.component.html',
  styleUrls: ['./user-tagging.component.css']
})
export class UserTaggingComponent implements OnInit {

  @Input() public user!: User

  constructor(
    private chatbox: ChatboxComponent
  ) { }

  ngOnInit(): void {
  }

  sendValue() {
    this.chatbox.setTag(this.user);
  }
}
