/*
 * how to run server
 * open a new terminal
 * type 'ts-node -T server/nodejs/server.ts'
 * server will be running and display the id numbers
 *      of all clients connected
 */

import { Namespace, Server, Socket } from 'socket.io';
import * as mysql from 'mysql2';
import {
    Channel,
    User,
    Membership,
    Message,
    Audit,
    Events,
    Settings,
    Customer,
    Notification,
    Reference,
    FileData,
} from '../../shared/models/Model';
import '../../shared/helpers/serverSocket';
import { SQL } from './modules/sqlHelper';
import { ResultSetHeader } from 'mysql2';
import { Env } from './environment/env';
import { env } from 'process';

const pool = mysql.createPool(Env.db).promise();

const io = new Server(3000, Env.io);

const serverName = env['SERVER_NAME']?.toString() ?? 'Oplogic Chat';
const chatSocket = establishSocketEvents(io, 'chats');
console.log('Server is started.\n');

function establishSocketEvents(
    socketServer: Server,
    namespace?: string
): Namespace | Server {
    let socketNamespace: Namespace | undefined;
    if (namespace != undefined && namespace.trim() != '') {
        socketNamespace = socketServer.of(`/${namespace}`);
    }

    let sio = socketNamespace ?? socketServer;

    // connection established between the server and the client
    sio.on('connection', (socket) => {
        setInitialEvents(socket);
        setLoginEvents(socket);

        // TODO: These events need to execute only when the client is identified
        setAuditEvents(socket);
        setCustomerEvents(socket);
        setChannelEvents(socket);
        setMembershipEvents(socket);
        setMessageEvents(socket);
        setNotificationEvents(socket);
        setReferenceEvents(socket);
        setSettingsEvents(socket);
        setUserEvents(socket);
        setTagEvents(socket);
    });

    return sio;
}

function setInitialEvents(socket: Socket) {
    // Let the clients know which server they're connected to
    socket.emit(Events.identifyServer, serverName);

    console.log(`New connection from ${socket.id}\n`);

    // If the client was already logged in before,
    // re-associate their user ID with the socket
    socket.on(Events.identifyClient, (userId: number) => {
        socket.userId = userId;
        socket.join(User.getRoomId(userId));
        console.log(`Associated socket ${socket.id} with userId ${userId}`);

        // Rejoin the user's channels
        pool.execute(SQL.getChannelsByUserId, [socket.userId]).then(
            ([rows, fields]) => {
                let res = rows as Channel[];

                for (const channel of res) {
                    socket.join(Channel.getRoomId(channel));
                }
            }
        );
    });
}

function setLoginEvents(socket: Socket) {
    socket.on(Events.loginUser, (userId: number) => {
        console.log(`[Login] Received login request for userId ${userId}`);
        pool.execute(SQL.getUserByUserId, [userId]).then(([rows, fields]) => {
            let res = rows as User[];
            if (res.length > 0) {
                let user = res.at(0);
                if (user?.id) socket.userId = user.id;

                console.log(`[Login] Logged in userId ${userId}`);
                let roomId = User.getRoomId(user!);
                console.log(`UserId ${socket.userId} joined room ${roomId}`);
                socket.join(roomId);

                socket.emit(Events.updateCurrentUser, user);
            }
        });
    });
}

function setAuditEvents(socket: Socket) {
    socket.on(
        Events.editMessage,
        (originalMessage: Message, auditedMessage: Audit) => {
            //Editing messages
            pool.execute(SQL.updateMessageEdit, [originalMessage.id]).then(
                ([updateRows, updateFields]) => {
                    pool.execute(
                        SQL.createAudit,
                        SQL.convertToSQLDate(auditedMessage)
                    ).then(([rows, fields]) => {
                        console.log(`Message edited`);
                        let res = rows as ResultSetHeader;
                        auditedMessage.id = res.insertId;

                        chatSocket
                            .to(Message.getRoomId(originalMessage))
                            .emit(Events.receiveEdit, auditedMessage);
                    });
                }
            );
        }
    );
    socket.on(
        Events.deleteMessage,
        (originalMessage: Message, auditedMessage: Audit) => {
            //Deleting messages
            pool.execute(SQL.updateMessageDelete, [originalMessage.id]).then(
                ([updateRows, updateFields]) => {
                    pool.execute(
                        SQL.createAudit,
                        SQL.convertToSQLDate(auditedMessage)
                    ).then(([rows, fields]) => {
                        console.log(`Message deleted`);
                        let res = rows as ResultSetHeader;
                        auditedMessage.id = res.insertId;

                        chatSocket
                            .to(Message.getRoomId(originalMessage))
                            .emit(Events.receiveDelete, auditedMessage);
                    });
                }
            );
        }
    );
}

function setCustomerEvents(socket: Socket) {
    socket.on(Events.requestAllCustomerProfiles, () => {
        pool.execute(SQL.getAllCustomers).then(([rows, fields]) => {
            let res = rows as Customer[];

            socket.emit(Events.receiveAllCustomerProfiles, res);
        });
    });
}

function setChannelEvents(socket: Socket) {
    socket.on(Events.createChannel, (channel: Channel) => {
        pool.execute(SQL.createChannel, SQL.convertToSQLDate(channel)).then(
            ([result, fields]) => {
                let res = result as ResultSetHeader;
                channel.id = res.insertId;

                let membership = new Membership();
                membership.isChannelAdmin = true;
                membership.membershipChannelId = channel.id;
                membership.membershipUserId = socket.userId;

                pool.execute(SQL.createMembership, membership).then(() => {
                    socket.emit(Events.channelCreated, channel);
                });
            }
        );
    });

    socket.on(Events.deleteChannel, (channel: Channel) => {
        pool.execute(SQL.deleteChannel, channel).then(([rows, fields]) => {
            socket
                .to(Channel.getRoomId(channel))
                .emit(Events.channelDeleted, channel);
        });
    });

    socket.on(Events.requestMyChannels, () => {
        console.log(`[Channel] Get userId ${socket.userId}'s channels`);

        pool.execute(SQL.getChannelsByUserId, [socket.userId]).then(
            ([rows, fields]) => {
                let res = rows as Channel[];

                for (const channel of res) {
                    socket.join(Channel.getRoomId(channel));
                }

                console.log(
                    `[Channel] UserId ${
                        socket.userId
                    } joined these rooms:\n\t[${res
                        .map((c) => Channel.getRoomId(c))
                        .join(', ')}]`
                );

                console.log(
                    `[Channel] Sending userId ${socket.userId}'s channels`
                );

                socket.emit(Events.receiveMyChannels, res);
            }
        );
    });

    socket.on(Events.updateCurrentChannel, (channel: Channel) => {
        let roomId = Channel.getRoomId(channel);

        console.log(`UserId ${socket.userId} joined room ${roomId}`);
        socket.join(roomId);
    });
}

function setMembershipEvents(socket: Socket) {
    socket.on(Events.createMembership, (membership: Membership) => {
        let prevMembership: Membership;

        pool.execute(SQL.getMembershipByChannelAndUserId, membership)
            .then(([rows, fields]) => {
                let res = rows as Membership[];

                for (const m of res) {
                    if (
                        m &&
                        membership &&
                        m.membershipUserId == membership.membershipUserId &&
                        m.membershipChannelId == membership.membershipChannelId
                    ) {
                        prevMembership = m;
                        break;
                    }
                }
            })
            .then(() => {
                if (!prevMembership) {
                    pool.execute(SQL.createMembership, membership).then(() => {
                        if (
                            membership.membershipUserId &&
                            membership.membershipChannelId
                        ) {
                            socket.emit(Events.membershipCreated, membership);

                            let channelRoomId = Channel.getRoomId(
                                membership.membershipChannelId
                            );

                            let memberRoomId = User.getRoomId(
                                membership.membershipUserId
                            );

                            if (membership.membershipUserId != socket.userId) {
                                chatSocket
                                    .to(channelRoomId)
                                    .emit(Events.membershipCreated, membership);

                                chatSocket
                                    .to(memberRoomId)
                                    .emit(Events.membershipCreated, membership);
                            }

                            chatSocket
                                .in(memberRoomId)
                                .socketsJoin(channelRoomId);
                        }
                    });
                } else {
                    pool.execute(SQL.updateMembership, membership).then(() => {
                        socket.emit(Events.membershipCreated);
                    });
                }
            });
    });

    socket.on(Events.deleteMembership, (membership: Membership) => {
        pool.execute(SQL.deleteMembership, membership).then(() => {
            if (membership.membershipUserId && membership.membershipChannelId) {
                socket.emit(Events.membershipDeleted, membership);

                let channelRoomId = Channel.getRoomId(
                    membership.membershipChannelId
                );

                let memberRoomId = User.getRoomId(membership.membershipUserId);

                if (membership.membershipUserId != socket.userId) {
                    chatSocket
                        .to(channelRoomId)
                        .emit(Events.membershipDeleted, membership);
                }

                chatSocket.in(memberRoomId).socketsLeave(channelRoomId);
            }
        });
    });
}

function setMessageEvents(socket: Socket) {
    socket.on(Events.sendMessage, (message: Message, files: FileData[]) => {
        pool.execute(SQL.createMessage, SQL.convertToSQLDate(message)).then(
            ([messageRows, messageFields]) => {
                let messageRes = messageRows as ResultSetHeader;
                message.id = messageRes.insertId;
                for (let i = 0; i < files.length; ++i) {
                    files[i].fileDataMessageId = message.id;
                    pool.execute(
                        SQL.createFileData,
                        SQL.convertToSQLDate(files[i])
                    ).then(([rows, fields]) => {
                        let res = rows as ResultSetHeader;
                        files[i].id = res.insertId;
                        if (i == files.length - 1) {
                            //On the last iteration, send files
                            chatSocket
                                .to(Message.getRoomId(message))
                                .emit(Events.receiveMessage, [message, files]);
                        }
                    });
                }
                if (files.length == 0) {
                    //If no files have to be stored in db. Files is empty in this case.
                    chatSocket
                        .to(Message.getRoomId(message))
                        .emit(Events.receiveMessage, [message, files]);
                }
            }
        );
    });

    socket.on(Events.requestChannelMessages, (channel: Channel) => {
        console.log(
            `[Message] userId ${socket.userId} requested all messages in channelId ${channel.id}`
        );
        pool.execute(SQL.getMessagesByChannelId, [channel.id]).then(
            ([messageRows, messageFields]) => {
                let messageRes = messageRows as any[];
                pool.execute(SQL.getFilesByChannelId, [channel.id]).then(
                    ([fileRows, fileFields]) => {
                        let fileRes = fileRows as FileData[];
                        pool.execute(SQL.getAuditsByChannelId, [
                            channel.id,
                        ]).then(([auditRows, auditFields]) => {
                            let auditRes = auditRows as Audit[];
                            messageRes.forEach((messageElement) => {
                                if (messageElement.isEdited == true) {
                                    for (let i = 0; i < auditRes.length; ++i) {
                                        if (
                                            auditRes[i].auditMessageId ==
                                            messageElement.id
                                        ) {
                                            messageElement.message =
                                                auditRes[i].newValue;
                                            break;
                                        }
                                    }
                                }
                            });
                            console.log(
                                `[Message] Sending messages in ${channel.id} to userId ${socket.userId}`
                            );
                            socket.emit(Events.receiveChannelMessages, [
                                channel,
                                messageRes,
                                fileRes,
                            ]);
                        });
                    }
                );
            }
        );
    });
}

function setNotificationEvents(socket: Socket) {
    socket.on(
        Events.sendNotification,
        (tags: User[], channel: Channel, user: User) => {
            tags.forEach((tag) => {
                //Notify users
                let notification = new Notification({
                    notificationUserIdSender: user.id ?? -1,
                    notificationUserIdReceiver: tag.id ?? -1,
                    notificationChannelId: channel.id ?? -1,
                    viewed: false,
                });
                pool.execute(SQL.createNotification, notification).then(
                    ([notiRow, notiField]) => {
                        pool.execute(SQL.getNotificationsByUserAndChannel, [
                            channel.id,
                            tag.id,
                        ]).then(([notificationRows, notificationFields]) => {
                            let notificationRes =
                                notificationRows as Notification[];
                            chatSocket
                                .to(User.getRoomId(tag))
                                .emit(Events.receiveNotification, [
                                    notificationRes,
                                    channel,
                                ]);
                        });
                    }
                );
            });
        }
    );
    socket.on(Events.retreiveNotifications, (channel: Channel, user: User) => {
        pool.execute(SQL.getNotificationsByUserAndChannel, [
            channel.id,
            user.id,
        ]).then(([notificationRows, notificationFields]) => {
            let notificationRes = notificationRows as Notification[];
            chatSocket
                .to(User.getRoomId(user))
                .emit(Events.receiveNotification, [notificationRes, channel]);
        });
    });
    socket.on(Events.clearNotifications, (channel: Channel, user: User) => {
        pool.execute(SQL.updateViewedNotifications, [channel.id, user.id]).then(
            ([notificationUpdateRows, notificationUpdateFields]) => {}
        );
    });
}

function setReferenceEvents(socket: Socket) {
    socket.on(Events.requestChannelReferences, (channel: Channel) => {
        pool.execute(SQL.getReferencesByChannelId, [channel.id]).then(
            ([rows, fields]) => {
                let res = rows as Reference[];

                socket.emit(Events.receiveChannelReferences, [channel, res]);
            }
        );
    });

    socket.on(Events.sendReference, (reference: Reference) => {
        pool.execute(SQL.createCustomerReference, reference).then(
            ([rows, fields]) => {
                let res = rows as ResultSetHeader;
                reference.id = res.insertId;

                socket.emit(Events.receiveReference, reference);
            }
        );
    });

    socket.on(
        Events.sendReferences,
        (channel: Channel, references: Reference[]) => {
            let valuesArray = [];
            for (let ref of references) {
                let r = new Reference(ref); // TODO: UNUSED, REMOVE THIS
                SQL.convertToSQLDate(ref);
                delete (ref as any).id;
                valuesArray.push(Object.values(ref));
            }

            // Need to use 'query' here for bulk-insert operation
            pool.query(SQL.createCustomerReference, [valuesArray]).then(
                ([rows, fields]) => {
                    let res = rows as ResultSetHeader;

                    for (let [index, reference] of references.entries()) {
                        reference.id = res?.insertId + index;
                    }

                    console.log(
                        `[Reference] Sending references from userId ${
                            socket.userId
                        } to channel ${Channel.getRoomId(channel)}`
                    );

                    chatSocket
                        .to(Channel.getRoomId(channel))
                        .emit(Events.receiveReferences, references);
                }
            );
        }
    );
}

function setSettingsEvents(socket: Socket) {
    socket.on(Events.requestMySettings, () => {
        pool.execute(SQL.getSettingsByUserId, [socket.userId]).then(
            ([rows, fields]) => {
                let res = rows as Settings[];

                for (const settings of res) {
                    if (settings && settings.settingsUserId == socket.userId) {
                        socket.emit(Events.receiveMySettings, settings);
                        break;
                    }
                }
            }
        );
    });

    socket.on(Events.updateSettings, (settings: Settings) => {
        let previousSetting: Settings;
        pool.execute(SQL.getSettingsByUserId, [socket.userId])
            .then(([rows, fields]) => {
                let res = rows as Settings[];

                for (const settings of res) {
                    if (settings && settings.settingsUserId == socket.userId) {
                        previousSetting = settings;
                        break;
                    }
                }
            })
            .then(() => {
                if (!previousSetting) {
                    pool.execute(SQL.createSettings, settings).then(
                        ([rows, fields]) => {
                            let res = rows as ResultSetHeader;
                            settings.id = res.insertId;

                            socket.emit(Events.settingsUpdated, settings);
                        }
                    );
                } else {
                    pool.execute(SQL.updateUserSettingsByUserId, settings).then(
                        ([rows, fields]) => {
                            let res = rows as ResultSetHeader;

                            socket.emit(Events.settingsUpdated, settings);
                        }
                    );
                }
            });
    });
}

function setUserEvents(socket: Socket) {
    socket.on(Events.requestAllUsers, () => {
        console.log(`[User] userId ${socket.userId} requested all users`);
        pool.execute(SQL.getAllUsers).then(([rows, fields]) => {
            let res = rows as User[];
            console.log(`[User] Sending all users to userId ${socket.userId}`);
            socket.emit(Events.receiveAllUsers, res);
        });
    });

    socket.on(Events.requestChannelUsers, (channel: Channel) => {
        console.log(
            `[User] userId ${socket.userId} requested all users part of channelId ${channel.id}`
        );
        pool.execute(SQL.getUsersByChannelId, [channel.id])
            .then(([rows, fields]) => {
                let res = rows as User[];

                console.log(
                    `[User] sending users part of channelId ${channel.id} to userId ${socket.userId}`
                );
                socket.emit(Events.receiveChannelUsers, [channel, res]);
            })
            .catch((r) => {
                console.log(r);
            });
    });

    socket.on(Events.requestChannelUsersByMessages, (channel: Channel) => {
        pool.execute(SQL.getUsersFromMessagesAndMembershipByChannelId, [
            channel.id,
            channel.id,
        ])
            .then(([rows, fields]) => {
                let res = rows as User[];

                console.log(
                    `[User] sending users part of channelId ${channel.id} to userId ${socket.userId}`
                );
                socket.emit(Events.receiveChannelUsersByMessages, [
                    channel,
                    res,
                ]);
            })
            .catch((r) => {
                console.log(r);
            });
    });

    socket.on(Events.requestChannelAdmins, (channel: Channel) => {
        pool.execute(SQL.getChannelAdminsByChannelId, [channel.id]).then(
            ([rows, fields]) => {
                let res = rows as User[];
                socket.emit(Events.receiveChannelAdmins, [channel, res]);
            }
        );
    });
}

function setTagEvents(socket: Socket) {
    socket.on(Events.requestAutoTag, (channel: Channel) => {
        pool.execute(SQL.getUsersByChannelId, [channel.id]).then(
            ([rows, fields]) => {
                let res = rows as User[];
                socket.emit(Events.receiveAutoTag, [channel, res]);
            }
        );
    });
    socket.on(Events.requestColorTags, (channel: Channel) => {
        pool.execute(SQL.getUsersByChannelId, [channel.id]).then(
            ([rows, fields]) => {
                let res = rows as User[];
                socket.emit(Events.receiveColorTags, [channel, res]);
            }
        );
    });
}

//#region DEBUG METHODS
function getChatSockets(socketNamespace: Namespace): Socket[] {
    return Array.from(socketNamespace.sockets.values());
}

function printClients(socketNamespace: Namespace) {
    socketNamespace.fetchSockets().then((sockets) => {
        sockets.forEach((socket) => {
            console.log('Key: ');
            console.log(socket.id);
            console.log('Rooms: ');
            console.log([...socket.rooms].join(', ') + '\n');
        });
    });
}

process.on('uncaughtException', function (err) {
    console.info(err);
});
//#endregion
