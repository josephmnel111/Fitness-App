import {
    Component,
    OnInit,
    TrackByFunction,
    Input,
    ViewChildren,
    QueryList,
    AfterViewInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import { SocketService } from 'src/services/socketService/socket.service';
import { Message, Reference, FileData } from 'src/../../shared/models/Model';

@Component({
    selector: 'msgContainer',
    templateUrl: './msgContainer.component.html',
    styleUrls: ['./msgContainer.component.css'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MsgBoxComponent implements OnInit, AfterViewInit {
    constructor(
        private socket: SocketService
    ) {}

    @ViewChildren('msgContainer')
    public msgContainer!: QueryList<any>; //container for where all messages will be populated

    public c: any[] = [];
    public allMessages: Message[] = [];
    public content: any[] = [];
    public imgSource: string = '';
    public docSource: string = '';
    private contentSlice = -50;

    ngAfterViewInit(): void {
        this.msgContainer.changes.subscribe(() => {
            this.scrollView();
        });
    }

    ngOnInit(): void {
        // Subscribe to when the current channel is updated
        this.socket.currentChannelUpdates.subscribe(async (curChannel) => {
            if (curChannel.id) {
                let all: any[] =
                    this.socket.channelMessages.get(curChannel.id) ?? [];
                all.push(
                    ...(this.socket.channelReferences.get(curChannel.id) ?? [])
                );

                await this.sortContent(all);
                this.c = all.slice(this.contentSlice);
            }
        });

        // Wait to receive both message & references in the channel, then combine, sort, and display.
        // Single test shows this can handle 250+ objects in a single collection
        this.socket.receiveMessagesAndReferencesInChannel.subscribe(
            async ([[mchannel, messages, files], [rchannel, references]]) => {
                if (mchannel.id == rchannel.id) {
                    Message.ensureDateType(messages);
                    Reference.ensureDateType(references);

                    this.allMessages = [];
                    this.content = messages;
                    messages.forEach(val => {
                        var x = new Message;
                        x = val;
                        this.allMessages.push(x);
                    })
                    this.content.push(...references);
                    await this.sortContent(this.content);
                    this.c = this.content.slice(this.contentSlice);
                    this.addFiles(files);
                }
            }
        );

        this.socket.receiveMessage.subscribe(async ([message, files]) => {
            if (this.socket.currentChannel != undefined) {
                if (message.messageChannelId == this.socket.currentChannel.id) {
                    Message.ensureDateType([message]);
                    this.content.push(message);
                    this.c.push(message);
                    files.forEach(file => {
                        this.c.push({data: file.data, type: file.type, name: file.name});
                    });
                }
            }
        });

        this.socket.receiveReference.subscribe(async (reference) => {
            if (this.socket.currentChannel != undefined) {
                if (reference.referenceChannelId == this.socket.currentChannel.id) {
                    Reference.ensureDateType([reference]);
                    this.content.push(reference);
                    this.c.push(reference);
                }
            }
        });

        this.socket.receiveReferences.subscribe(async (references) => {
            if (
                references.every(
                    (r) => r.referenceChannelId == this.socket.currentChannel.id
                )
            ) {
                Reference.ensureDateType(references);
                this.content.push(...references);
                this.c.push(...references);
            }
        });
    }

    private async sortContent(content: any[]) {
        content = content.sort((a, b) => {
            let msgA = a as Message | Reference;
            let msgB = b as Message | Reference;

            if (msgA.timeSent && msgB.timeSent) {
                let msgATime = new Date(msgA.timeSent);
                let msgBTime = new Date(msgB.timeSent);
                return msgATime.getTime() - msgBTime.getTime();
            }

            return 0;
        });
    }
    private addFiles(files: FileData[]) {
        console.log(files);
        let fileTracker = 0;
        let copy = this.c.slice(); //Copy of c that will not change
        for (let i = 0; i < files.length; ++i) {
            if (files[fileTracker].fileDataMessageId! < copy[0].id) { //Finds first file to be displayed in message list
                ++fileTracker;
            }
        }
        let array:any = [];
        let exitLoop = false;
        copy.forEach(val => { //Adds files to display array based on the message they are connected to
            array.push(val);
            exitLoop = false;
            if (files[fileTracker] != undefined) {
                while ((exitLoop == false) && (files[fileTracker].fileDataMessageId == val.id)) {
                    array.push({data: files[fileTracker].data, type: files[fileTracker].type, name: files[fileTracker].name})
                    if (files[fileTracker + 1] == undefined) {
                        exitLoop = true;
                    }
                    ++fileTracker;
                }
                
            }
        })
        this.c = array;
        console.log(this.c);
    }

    public scrollView() {
        var messagesContent = document.querySelector('#messagesContent');
        if (messagesContent != null) {
            messagesContent.scrollTop = messagesContent.scrollHeight;
        }
    }

    public isMessage(obj: any) {
        let msg = obj as Message;
        return msg && msg.id && msg.messageChannelId && msg.messageSenderId;
    }

    public isReference(obj: any) {
        let ref = obj as Reference;

        return ref && ref.id && ref.referenceChannelId && ref.referenceCustomerId;
    }

    public isImage(obj: any) {
        if (obj.type != undefined) {
            if ((obj.type == 'image/jpeg') || (obj.type == 'image/png')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public isDoc(obj: any) {
        if (obj.type != undefined) {
            if ((obj.type == 'application/pdf') || (obj.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') || (obj.type == 'application/msword')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    // Helps to reduce View updates on data changes
    @Input()
    ngForTrackBy: TrackByFunction<any> = (
        index: number,
        item: any
    ) => {
        if (this.isMessage(item)) {
            if (item && item.id) return -item.id;
        }

        if (this.isReference(item)) {
            if (item && item.id) return item.id;
        }

        return index;
    };

    // async infiniteScroll(event: any) {
    //     let e = event as InfiniteScrollCustomEvent;

    //     this.contentSlice -= 10;
    //     this.c = this.content.slice(this.contentSlice);

    //     e.target.complete();
    //     e.target.disabled = this.contentSlice <= -this.content.length;

    //     console.log(e);
    // }
}
