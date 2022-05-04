import { Channel, Customer, User } from '../Model';
import { ChannelState } from './channelState';
import equal from 'fast-deep-equal';

export class SessionState {
    public currentUser!: User;
    public currentChannel!: Channel;

    public publicUsers: Map<number, User> = new Map();
    public publicCustomers: Map<number, Customer> = new Map();

    public publicChannels: Map<number, Channel> = new Map();
    public channelStates: Map<number, ChannelState> = new Map();

    public copyFrom(previous: SessionState): SessionState {
        if (previous) Object.assign(this, previous);
        return this;
    }

    public static equal(
        previous: SessionState,
        current: SessionState
    ): boolean {
        return equal(previous, current);
    }
}
