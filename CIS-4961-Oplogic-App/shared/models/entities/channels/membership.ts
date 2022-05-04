export class Membership {
    public id: number | null = null;
    public isChannelAdmin: boolean | null = null;
    public membershipChannelId: number | null = null;
    public membershipUserId: number | null = null;

    constructor(
        obj?:
            | {
                  id?: number;
                  isChannelAdmin: boolean;
                  membershipChannelId: number;
                  membershipUserId: number;
              }
            | Membership
    ) {
        if (obj) Object.assign(this, obj);
    }
}
