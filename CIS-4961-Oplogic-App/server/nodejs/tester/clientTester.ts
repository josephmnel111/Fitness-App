import { AssertionError } from 'assert';
import * as io from 'socket.io-client';
import {
    User,
    Events,
    Message,
    Scope,
    Channel,
} from '../../../shared/models/Model';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const newClient = () =>
    io.connect('http://localhost:3000/chats', {
        transports: ['websocket', 'polling'],
    });

const socketIndexMap = new Map<io.Socket, number>();

class SocketService {
    public static connectUser(user: User, socketIndex?: number): io.Socket {
        const socket = newClient();

        console.log(`Created socket ${socketIndex}`);

        socket.on('connect', () => {
            socket.emit(Events.identifyClient, user.id);
            console.log(`Connected socket ${socketIndex} as user ${user.id}`);

            socket.emit(Events.requestMyChannels);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket ${socketIndex} disconnected: ${reason}`);
        });

        socket.on('error', (error) => {
            console.log(error);
        });

        return socket;
    }

    public static async multiTest(n: number = 2) {
        let setup = newClient();

        setup.on('connect', () => {
            setup.emit(Events.requestAllUsers);
        });

        setup.on(Events.receiveAllUsers, (users: User[]) => {
            setup.disconnect();

            for (let i = 1; i <= n; i++) {
                let user = users.at(
                    Math.round(Math.random() * users.length - 1)
                );

                if (!user || !user.id) {
                    console.log(`Failed to associate socket ${i} to a user`);
                    continue;
                }

                let socket: io.Socket = this.connectUser(user, i);

                socket.on(Events.receiveMyChannels, (channels: Channel[]) => {
                    let channel = channels.at(
                        Math.round(Math.random() * channels.length - 1)
                    );

                    if (!channel || !channel.id) {
                        throw new Error(
                            `Undefined channel used by socket ${i}`
                        );
                    }

                    setInterval(
                        () => this.sendMessage(user, channel, socket),
                        30000 + Math.random() * 60000
                    );

                    setInterval(
                        () => this.switchChannel(channel, channels, socket),
                        60000 + Math.random() * 90000
                    );
                });
            }
        });
    }

    private static sendMessage(
        user: User | undefined,
        channel: Channel | undefined,
        socket: io.Socket
    ) {
        if (channel && user && channel.id && user.id) {
            let message = new Message({
                message: 'ping!'.repeat(10),
                messageChannelId: channel.id,
                messageSenderId: user.id,
            });

            socket.emit(Events.sendMessage, message, []);
        }
    }

    private static switchChannel(
        channel: Channel | undefined,
        channels: (Channel | undefined)[],
        socket: io.Socket
    ) {
        channel = channels.at(Math.round(Math.random() * channels.length - 1));

        if (channel && channel.id) {
            socket.emit(Events.updateCurrentChannel, channel);
        }
    }

    public static scopesTest() {
        let parsedScopes = Scope.getScopes(':' + Scope.dm + Events.sendMessage);

        if (parsedScopes.length != 2)
            throw new AssertionError({
                expected: [Scope.dm, Scope.message],
                actual: parsedScopes,
            });
    }
}

// SocketService.scopesTest();

// SocketService.multiTest(10);

SocketService.multiTest(500);
