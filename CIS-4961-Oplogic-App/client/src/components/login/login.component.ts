import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectCustomEvent } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { SocketService } from 'src/services/socketService/socket.service';
import { User } from 'src/../../shared/models/Model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    private userId?: number;

    loginForm: FormGroup;
    users: User[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private socket: SocketService,
        private appComponent: AppComponent
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.socket.requestAllUsers();

        this.socket.receiveAllUsers.subscribe((users) => {
            this.users = users;
        });

        this.socket.userUpdated.subscribe(() => {
            this.appComponent.displayLogin = false;
        });
    }

    onChange(e: Event) {
        const event = e as SelectCustomEvent;
        let userId = event.detail.value;
        this.userId = userId;
    }

    onSubmit() {
        if (this.userId) {
            this.socket.loginUser(this.userId);
        }
    }
}
