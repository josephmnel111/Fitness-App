import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'server-icon',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  @Input()
  public icon: string = 'error_outline';

  @Input()
  public name: string = '';

  @Input()
  public active: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
