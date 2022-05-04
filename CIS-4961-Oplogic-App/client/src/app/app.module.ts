import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { ServersComponent } from 'src/components/servers/servers.component';
import { ConversationsComponent } from 'src/components/conversations/conversations.component';
import { ChannelsComponent } from 'src/components/channels/channels.component';
import { ChatboxComponent } from 'src/components/chatbox/chatbox.component';
import { IonicModule } from '@ionic/angular';
import { MessagesComponent } from '../components/msgContainer/messages/messages.component';
import { MsgBoxComponent } from '../components/msgContainer/msgContainer.component';
import { SocketService } from '../services/socketService/socket.service';
import { MsgPopoverComponent } from '../components/msgContainer/msg-popover/msg-popover.component';
import { AttachmentPopoverComponent } from '../components/chatbox/attachment-popover/attachment-popover.component';
import { FilePreviewComponent } from '../components/file-preview/file-preview.component';
import { UserIconComponent } from 'src/components/userIcon/userIcon.component';
import { AddChannelComponent } from 'src/components/add-channel/add-channel.component';
import { AddMessageComponent } from 'src/components/add-message/add-message.component';
import { CustomerProfilesComponent } from 'src/components/customer-profiles/customer-profiles.component';
import { ProfileReferencesComponent } from 'src/components/msgContainer/profile-references/profile-references.component';
import { LoginComponent } from 'src/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ChannelToolsPopoverComponent } from '../components/chatbox/channel-tools-popover/channel-tools-popover.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserToolsPopoverComponent } from '../components/user-tools-popover/user-tools-popover.component';
import { NotifModalComponent } from '../components/notif-modal/notif-modal.component';
import { NotifSettingsComponent } from '../components/notif-modal/notif-settings/notif-settings.component';
import { NotificationComponent } from '../components/notif-modal/notification/notification.component';
import { UserTaggingComponent } from 'src/components/chatbox/user-tagging/user-tagging.component';
import { AddChannelPanelComponent } from '../components/add-channel/add-channel-panel/add-channel-panel.component';
import { AddMessagePanelComponent } from '../components/add-message/add-message-panel/add-message-panel.component';
import { ImageFilesComponent } from 'src/components/msgContainer/image-files/image-files.component';
import { DocFilesComponent } from '../components/msgContainer/doc-files/doc-files.component';

const config: SocketIoConfig = {
    url: environment.socketUrl + environment.socketNamespace,
    options: {
        transports: ['websocket', 'polling'],
    },
};

@NgModule({
    declarations: [
        AppComponent,
        ServersComponent,
        ConversationsComponent,
        ChannelsComponent,
        MessagesComponent,
        MsgBoxComponent,
        AddChannelComponent,
        AddMessageComponent,
        CustomerProfilesComponent,
        LoginComponent,
        ChatboxComponent,
        AddChannelComponent,
        AddMessageComponent,
        CustomerProfilesComponent,
        LoginComponent,
        MsgPopoverComponent,
        AttachmentPopoverComponent,
        FilePreviewComponent,
        UserIconComponent,
        ProfileReferencesComponent,
        ChannelToolsPopoverComponent,
        UserToolsPopoverComponent,
        NotifModalComponent,
        NotifSettingsComponent,
        NotificationComponent,
        UserTaggingComponent,
        AddChannelPanelComponent,
        AddMessagePanelComponent,
        ImageFilesComponent,
        DocFilesComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        SocketIoModule.forRoot(config),
        ScrollingModule,
    ],
    providers: [SocketService],
    bootstrap: [AppComponent],
})
export class AppModule {}
