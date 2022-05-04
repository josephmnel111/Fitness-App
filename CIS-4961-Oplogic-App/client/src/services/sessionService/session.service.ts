import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import {
  Channel,
  SessionState,
  ChannelState,
  User,
  Reference,
  Message,
  Customer,
} from 'src/../../shared/models/Model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  //#region Initialization

  private stateSubject: BehaviorSubject<SessionState> = new BehaviorSubject(
    new SessionState()
  );

  private get state(): SessionState {
    return this.stateSubject.value;
  }

  private getStateCopy(): SessionState {
    return new SessionState().copyFrom(this.state);
  }

  // Ignore the first empty state update from BehaviorSubject
  public stateUpdates = this.stateSubject.pipe(
    skip(1),
    distinctUntilChanged((previous, current) =>
      SessionState.equal(previous, current)
    )
  );

  private update(state: SessionState) {
    this.stateSubject.next(state);
  }

  //#endregion

  //#region Customers

  public set publicCustomers(customers: Customer[]) {
    let state = this.getStateCopy();
    let needsUpdate = false;

    for (const customer of customers) {
      if (customer.pkindex) {
        state.publicCustomers.set(customer.pkindex, customer);
        needsUpdate = true;
      }
    }

    if (needsUpdate) this.update(state);
  }

  public get publicCustomers(): Customer[] {
    return Array.from(this.state.publicCustomers.values());
  }

  //#endregion

  //#region Channels

  public get currentChannel(): Channel {
    return this.state.currentChannel;
  }

  public set currentChannel(channel: Channel) {
    let state = this.getStateCopy();
    state.currentChannel = channel;

    this.update(state);
  }

  public get publicChannels(): Channel[] {
    return Array.from(this.state.publicChannels.values());
  }

  public set publicChannels(channels: Channel[]) {
    let state = this.getStateCopy();

    for (const channel of channels) {
      if (channel.id) state.publicChannels.set(channel.id, channel);
    }

    this.update(state);
  }

  public get myChannels(): Channel[] {
    let myChannels: Channel[] = [];
    const channelStates = this.state.channelStates.values();

    for (const state of channelStates) {
      const userArray = Array.from(state.users.values());
      const hasCurrentUser =
        userArray.find((u) => u.id == this.currentUser.id) != undefined;

      if (hasCurrentUser) {
        myChannels.push(state.channel);
      }
    }

    return myChannels;
  }

  public set myChannels(channels: Channel[]) {
    let state = this.getStateCopy();
    let needsUpdate = false;

    if (this.currentUser.id) {
      for (const channel of channels) {
        if (channel.id) {
          let channelState = state.channelStates.get(channel.id);

          if (!channelState) {
            let newState = new ChannelState(channel);
            newState.users.set(this.currentUser.id, this.currentUser);

            state.channelStates.set(channel.id, newState);
            needsUpdate = true;
          } else {
            let userArray = Array.from(channelState.users.values());

            if (!userArray.find((u) => u.id == this.currentUser.id)) {
              channelState.users.set(this.currentUser.id, this.currentUser);

              needsUpdate = true;
            }
          }
        }
      }
    }

    if (needsUpdate) this.update(state);
  }

  public setChannels(channels: Channel[]) {
    let state = this.getStateCopy();
    let needsUpdate = false;

    for (const channel of channels) {
      if (channel.id) {
        state.publicChannels.set(channel.id, channel);
        let channelState = state.channelStates.get(channel.id);

        if (!channelState) {
          let newState = new ChannelState(channel);
          state.channelStates.set(channel.id, newState);
        }

        needsUpdate = true;
      }
    }

    if (needsUpdate) this.update(state);
  }

  //#endregion

  //#region Messages

  public getMessagesInChannel(channel: Channel): Message[] {
    if (channel.id) {
      let channelState = this.state.channelStates.get(channel.id);

      if (channelState) {
        return Array.from(channelState.messages.values());
      }
    }

    return [];
  }

  public setMessages(messages: Message[]): Message[] {
    let state = this.getStateCopy();
    let needsUpdate = false;

    for (const message of messages) {
      if (!message.id || !message.messageChannelId) continue;

      let channelState = state.channelStates.get(message.messageChannelId);

      if (channelState) {
        channelState.messages.set(message.id, message);
      }
    }

    return [];
  }

  //#endregion

  //#region References

  public getReferencesInChannel(channel: Channel): Reference[] {
    if (channel.id) {
      let channelState = this.state.channelStates.get(channel.id);

      if (channelState) {
        return Array.from(channelState.references.values());
      }
    }

    return [];
  }

  public setReferences(references: Reference[]): Reference[] {
    let state = this.getStateCopy();
    let needsUpdate = false;

    for (const reference of references) {
      if (!reference.referenceChannelId || !reference.id) continue;

      let channelState = state.channelStates.get(reference.referenceChannelId);

      if (channelState) {
        channelState.references.set(reference.id, reference);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      this.update(state);
    }

    return [];
  }

  //#endregion

  //#region Settings
  //#endregion

  //#region Users

  public get currentUser(): User {
    return this.state.currentUser;
  }

  public set currentUser(user: User) {
    let state = this.getStateCopy();
    state.currentUser = user;

    this.update(state);
  }

  public get publicUsers(): User[] {
    return Array.from(this.state.publicUsers.values());
  }

  public set publicUsers(users: User[]) {
    let state = this.getStateCopy();
    let needsUpdate = false;

    for (const user of users) {
      if (user.id) state.publicUsers.set(user.id, user);
      needsUpdate = true;
    }

    if (needsUpdate) this.update(state);
  }

  public getUsersInChannel(channel: Channel): User[] {
    if (channel.id) {
      let channelState = this.state.channelStates.get(channel.id);

      if (channelState) {
        return Array.from(channelState.users.values());
      }
    }

    return [];
  }

  public setUsersInChannel(channel: Channel, users: User[]): [Channel, User[]] {
    if (channel.id) {
      let state = this.getStateCopy();
      let channelState = state.channelStates.get(channel.id);

      if (channelState) {
        for (const user of users) {
          if (user.id) channelState.users.set(user.id, user);
        }

        this.update(state);

        return [channel, users];
      }
    }

    return [channel, []];
  }

  public getModeratorsInChannel(channel: Channel): User[] {
    if (channel.id) {
      let channelState = this.state.channelStates.get(channel.id);

      if (channelState) {
        return Array.from(channelState.moderators.values());
      }
    }

    return [];
  }

  public setModeratorsInChannel(
    channel: Channel,
    users: User[]
  ): [Channel, User[]] {
    if (channel.id) {
      let state = this.getStateCopy();
      let channelState = state.channelStates.get(channel.id);

      if (channelState) {
        for (const user of users) {
          if (user.id) channelState.moderators.set(user.id, user);
        }

        this.update(state);

        return [channel, users];
      }
    }

    return [channel, []];
  }

  //#endregion

  //#region Combined Functions
  //#endregion
}
