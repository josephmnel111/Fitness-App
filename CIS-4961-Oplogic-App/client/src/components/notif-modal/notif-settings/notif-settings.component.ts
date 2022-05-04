import { Component, OnInit, Output } from '@angular/core';
import { CheckboxCustomEvent, ModalController } from '@ionic/angular';
import { SocketService } from 'src/services/socketService/socket.service';
// import { Settings } from '../../../../../shared/models/Model';
import { Settings } from 'src/../../shared/models/Model';

@Component({
    selector: 'app-notif-settings',
    templateUrl: './notif-settings.component.html',
    styleUrls: ['./notif-settings.component.css'],
})
export class NotifSettingsComponent implements OnInit {
    @Output()
    public settings!: Settings;

    constructor(
        public modalController: ModalController,
        private socket: SocketService
    ) {}

    ngOnInit(): void {
        this.settings = new Settings({
            disableAllNotifications: false,
            badgeEnabled: true,
            notifyOnDirectMessage: true,
            notifyOnEmail: true,
            notifyOnMention: true,
            notifyOnSMS: true,
            previewEnabled: true,
            settingsUserId: this.socket.currentUser.id ?? -1,
            soundEnabled: true,
        });

        this.socket.requestMySettings();

        this.socket.receiveMySettings.subscribe((settings) => {
            this.settings = settings;
        });
    }

    public onSettingsChange(e: Event) {
        let event = e as CheckboxCustomEvent;
    }

    public close() {
        this.socket.updateSettings(this.settings);
        this.modalController.dismiss();
    }
}
