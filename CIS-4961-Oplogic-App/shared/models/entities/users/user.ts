import { UserStatus } from './enums/userStatus';
import { Scope } from '../../Model';

export class User {
    public id: number | null = null;
    public displayName: string | null = null;
    public fullName: string | null = null;
    public profileImage: string | null = null;
    public email: string | null = null;
    public phoneNumber: string | null = null;
    public userStatus: UserStatus | null = null;
    public isSystemAdmin: boolean | null = null;

    constructor(
        obj?:
            | {
                  id?: number;
                  displayName: string;
                  fullName: string;
                  profileImage?: string;
                  email?: string;
                  phoneNumber?: string;
                  userStatus?: UserStatus;
                  isSystemAdmin?: boolean;
              }
            | User
    ) {
        if (obj) Object.assign(this, obj);
    }

    public static getRoomId(user: User | number): string {
        let scope = Scope.user + Scope.id;

        if (typeof user == 'number') {
            return scope + user;
        } else {
            return scope + user.id;
        }
    }
}
