import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddChannelPanelComponent } from './add-channel-panel/add-channel-panel.component';

@Component({
    selector: 'app-add-channel',
    templateUrl: './add-channel.component.html',
    styleUrls: ['./add-channel.component.css'],
})
export class AddChannelComponent implements OnInit {
    constructor(public modalController: ModalController) {

    }
    ngOnInit(): void {
        
    }
    public async addChannel() {
        const modal = await this.modalController.create({
            //Create modal
            component: AddChannelPanelComponent
        });

        await modal.present();
    }
}
