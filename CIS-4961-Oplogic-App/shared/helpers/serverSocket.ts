// JF: This file allows us to extend the default Socket
// declaration from the 'socket.io' package.
// The import is required for Module Augmentation
// and scoping.
//
// See https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// for more info.

import { Socket } from 'socket.io';

declare module 'socket.io' {
    class Socket {
        userId: number;
    }
}
