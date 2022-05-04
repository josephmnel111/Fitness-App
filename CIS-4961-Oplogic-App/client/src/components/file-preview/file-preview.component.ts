import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'file-preview',
    templateUrl: './file-preview.component.html',
    styleUrls: ['./file-preview.component.css'],
})
export class FilePreviewComponent implements OnInit {
    @Input()
    public file!: File;

    @Output()
    fileNameEvent = new EventEmitter<string>();

    public imgSource: string = '';
    public canPreview: boolean = false;
    public fileName: string = '';

    public fileData: any[] = [];

    constructor() {}

    ngOnInit(): void {
        this.fileName = this.file.name;

        //this.socket.sendFiles(this.file)

        // Allow preview if compatible file type
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/png') {

            this.canPreview = true;
            let reader = new FileReader();
            reader.readAsDataURL(this.file);

            // Function done when reader is done with encoding file to base64
            reader.onload = (events: any) => {
                this.imgSource = events.target.result;
            };
        }
    }

    outputFileName() {
        this.fileNameEvent.emit(this.fileName);
    }
}
