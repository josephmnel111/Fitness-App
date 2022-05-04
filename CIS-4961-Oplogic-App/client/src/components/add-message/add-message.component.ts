import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddMessagePanelComponent } from './add-message-panel/add-message-panel.component';

@Component({
    selector: 'app-add-message',
    templateUrl: './add-message.component.html',
    styleUrls: ['./add-message.component.css'],
})
export class AddMessageComponent implements OnInit {
    constructor(public modalController: ModalController) {

    }
    ngOnInit() {

    }
    public async addMessage() {
            const modal = await this.modalController.create({
                //Create modal
                component: AddMessagePanelComponent
            });

            await modal.present();
    }
}
