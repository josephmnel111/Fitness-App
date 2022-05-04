import { Customer } from '../../Model';

export class Reference {
    public id: number | null = null;
    public referenceCustomerId: number | null = null;
    public referenceChannelId: number | null = null;
    public firstName: string | null = null;
    public lastName: string | null = null;
    public address: string | null = null;
    public phoneNumber: string | null = null;
    public email: string | null = null;
    public make: string | null = null;
    public model: string | null = null;
    public timeSent: Date | null = new Date();

    constructor(
        obj?:
            | {
                  id?: number;
                  referenceCustomerId: number;
                  referenceChannelId: number;
                  firstName: string;
                  lastName: string;
                  address: string;
                  phoneNumber: string;
                  email: string;
                  make: string;
                  model: string;
                  timeSent?: Date;
              }
            | Reference
    ) {
        if (obj) Object.assign(this, obj);
        if (obj?.timeSent) {
            this.timeSent = new Date(obj.timeSent);
        }
    }

    fromCustomer(channelId: number, customer: Customer) {
        Object.assign(this, customer);
        delete (this as any).pkindex;

        this.referenceCustomerId = customer.pkindex;
        this.referenceChannelId = channelId;

        return this;
    }

    public static ensureDateType(references: Reference[]): Reference[] {
        if (!references) {
            return [];
        }

        for (let reference of references) {
            if (reference.timeSent && !(reference.timeSent instanceof Date)) {
                reference.timeSent = new Date(reference.timeSent);
            }
        }

        return references;
    }
}
