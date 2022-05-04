import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ViewChildren,
    QueryList,
    Output,
    TrackByFunction,
    Input,
} from '@angular/core';
import { Channel } from 'src/../../shared/models/Model';
import { SocketService } from 'src/services/socketService/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
    private tagRegEx: RegExp = /@(?<tag>[a-zA-Z0-9.+\-~_]*[^@.\s])/;
    public serverName: string = 'Not Connected!';

    public unreadCount = 0;

    public displayLogin = true;

    constructor(private socket: SocketService) {
        socket.serverName.subscribe((name: string) => {
            document.title = name;
            this.serverName = name;
        });
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    @Output()
    public get directMessages(): Channel[] {
        return this.socket.myChannels.filter((c) => c.isDirectMessage);
    }

    @Output()
    public get groupMessages(): Channel[] {
        return this.socket.myChannels.filter((c) => !c.isDirectMessage);
    }

    @Input()
    trackChannel: TrackByFunction<any> = (index: number, item: Channel) => {
        return item.id;
    };
}
