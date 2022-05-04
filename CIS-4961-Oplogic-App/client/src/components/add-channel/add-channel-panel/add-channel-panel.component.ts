import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/services/socketService/socket.service';
import { Channel } from '../../../../../shared/models/Model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-channel-panel',
  templateUrl: './add-channel-panel.component.html',
  styleUrls: ['./add-channel-panel.component.css']
})
export class AddChannelPanelComponent implements OnInit {

    constructor(
        private socket: SocketService,
        private modalController: ModalController
    ) {}

    ngOnInit(): void {}

    onCancel() {
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    onSave(
        channelName: HTMLInputElement,
        channelDescription: HTMLInputElement,
        channelIsPrivate?: HTMLInputElement
    ) {
        const newChannel = new Channel({
            isPrivate: channelIsPrivate?.checked ?? false,
            isDirectMessage: false,
            name: channelName.value,
            description: channelDescription.value,
        });

        this.socket.createChannel(newChannel);
        
        this.modalController.dismiss({
            'dismissed': true
        });
    }

}
