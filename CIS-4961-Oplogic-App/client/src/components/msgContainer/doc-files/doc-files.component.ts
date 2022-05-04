import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-files',
  templateUrl: './doc-files.component.html',
  styleUrls: ['./doc-files.component.css']
})
export class DocFilesComponent implements OnInit {

  @Input() public doc!: any

  constructor() { }

  ngOnInit(): void {
  }

  downloadFile() {
    var blob = new Blob ([this.doc.data], {type: this.doc.type!});
    var url = window.URL || window.webkitURL;
    var link = url.createObjectURL(blob);
    var a = document.createElement("a");
    a.setAttribute("download", this.doc.name);
    a.setAttribute("href", link);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
