import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SocketService } from 'src/services/socketService/socket.service';
import { NotifSettingsComponent } from './notif-settings/notif-settings.component';

@Component({
    selector: 'app-notif-modal',
    templateUrl: './notif-modal.component.html',
    styleUrls: ['./notif-modal.component.css'],
})
export class NotifModalComponent implements OnInit {
    public ACTION_DICT = new Map([
        ['MESSAGE', 'sent you a message'],
        ['TAG', 'tagged you in a message'],
        ['ADD', 'added you in a channel'],
        ['TEXT', 'texted you a message'],
        ['EMAIL', 'sent you an email'],
        ['DRIVE', 'booked a test drive for'],
        ['SERVICE', 'booked a service appointment for'],
        ['QUOTE', 'requested a quote for'],
        ['RESERVE_CAR', 'just reserved a'],
    ]);

    public view: string = '';

    public DMNotif = [
        {
            name: 'Margaret Li',
            actionID: 'MESSAGE',
            message: 'Lorem ipsum dolor sit amet, lkjl;kjlkj',
            time: '1:25 PM',
        },
        {
            name: 'Anson Kong',
            actionID: 'TAG',
            message: '@Jason Keith pleaase forward the email....',
            time: '12:55 PM',
        },
        {
            name: 'Joseph Lam',
            actionID: 'ADD',
            message: 'Sales team',
            time: '10:23 AM',
        },
    ];

    public sms = [
        {
            name: 'Margaret Li',
            actionID: 'TEXT',
            message: 'Hi, I would like to meet in person to discuss further',
            time: '1:25 PM',
        },
        {
            name: 'Anson Kong',
            actionID: 'TEXT',
            message: 'Please call me back asap! Thanks.',
            time: '12:55 PM',
        },
        {
            name: 'Joseph Lam',
            actionID: 'TEXT',
            message: 'My car has some problems. need help...',
            time: '10:23 AM',
        },
        {
            name: 'Kelly Chen',
            actionID: 'TEXT',
            message:
                'Hi. I was here yesterday for an appointment, I left my car keys in...',
            time: '9:40 AM',
        },
        {
            name: 'Jayden Charles',
            actionID: 'TEXT',
            message: 'Hey! Are you free this coming Thursday?',
            time: '8:36 AM',
        },
    ];

    public email = [
        {
            name: 'Margaret Li',
            actionID: 'EMAIL',
            message: 'URGENT REQUEST - Please reply.',
            time: '1:25 PM',
        },
        {
            name: 'Anson Kong',
            actionID: 'EMAIL',
            message: 'Fall 2022 New Car Promotions',
            time: '12:55 PM',
        },
        {
            name: 'Joseph Lam',
            actionID: 'EMAIL',
            message: 'Need assistance on this model',
            time: '10:23 AM',
        },
        {
            name: 'Kelly Chen',
            actionID: 'EMAIL',
            message: 'Please diregard previous email',
            time: '9:40 AM',
        },
        {
            name: 'Jayden Charles',
            actionID: 'EMAIL',
            message: 'New Client Info',
            time: '8:36 AM',
        },
    ];

    public general = [
        {
            name: 'Margaret Li',
            actionID: 'DRIVE',
            message: 'Tuesday. June 12, 2022 at 12:00pm',
            time: '1:25 PM',
        },
        {
            name: 'Anson Kong',
            actionID: 'SERVICE',
            message: 'Monday, June 9, 2022 at 3:15pm',
            time: '12:55 PM',
        },
        {
            name: 'Joseph Lam',
            actionID: 'QUOTE',
            message: '2022 XXXXX Car Model',
            time: '10:23 AM',
        },
        {
            name: 'Jayden Charles',
            actionID: 'RESERVE_CAR',
            message: '2022 XXXXX Car Model',
            time: '8:36 AM',
        },
    ];

    constructor(
        public socket: SocketService,
        public modalController: ModalController
    ) {}

    ngOnInit(): void {
        this.socket.receiveMyChannels.subscribe((channels) => {
            if (this.socket.currentUser) {
                for (const channel of channels) {
                    this.socket.retreiveNotifications(
                        channel,
                        this.socket.currentUser
                    );
                }
            }
        });

        this.socket.userAddedToChannel.subscribe((membership) => {});

        this.socket.receiveNotification.subscribe(([notifs, channel]) => {});
    }

    switchView(event: any) {
        this.view = event.detail.value;
    }

    public async presentNotifSettingsModal() {
        const modal = await this.modalController.create({
            component: NotifSettingsComponent,
            backdropDismiss: false,
            cssClass: 'modal-notifications',
        });
        
        return await modal.present();
    }

    public close() {
        this.modalController.dismiss();
    }
}
