import {
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'userIcon',
    templateUrl: './userIcon.component.html',
    styleUrls: ['./userIcon.component.css'],
})
export class UserIconComponent implements OnInit, OnChanges {
    @Input()
    public scale: number = 1;

    @Input()
    public name?: string = '';

    @Output()
    public initials: string = '';

    public width: number = 1;
    public height: number = 1;
    public lineHeight: number = 1;
    public fontSize: number = 0.5;

    ngOnInit() {
        this.updateInitials();

        this.width *= this.scale;
        this.height *= this.scale;
        this.lineHeight *= this.scale;
        this.fontSize *= this.scale;
    }

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['name']) {
            this.updateInitials();
        }
    }

    private updateInitials() {
        this.initials =
            this.name
                ?.split(' ', 2)
                .map((s) => {
                    return s.substring(0, 1);
                })
                .join('')
                .toUpperCase() ?? '';
    }
}
