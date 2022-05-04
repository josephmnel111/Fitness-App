import { Channel, Message, Reference, User } from '../Model';

export class ChannelState {
    public channel: Channel;

    public users: Map<number, User> = new Map();
    public moderators: Map<number, User> = new Map();
    public messages: Map<number, Message> = new Map();
    public references: Map<number, Reference> = new Map();

    constructor(channel: Channel) {
        this.channel = channel;
    }
}
