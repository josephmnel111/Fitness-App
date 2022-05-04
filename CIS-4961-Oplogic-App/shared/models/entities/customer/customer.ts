export class Customer {
    public pkindex: number | null = null;
    public firstName: string | null = null;
    public lastName: string | null = null;
    public address: string | null = null;
    public phoneNumber: string | null = null;
    public email: string | null = null;
    public make: string | null = null;
    public model: string | null = null;

    constructor(obj?: {
        pkindex: number;
        firstName: string;
        lastName: string;
        address: string;
        phoneNumber: string;
        email: string;
        make: string;
        model: string;
    } | Customer) {
        if (obj) Object.assign(this, obj);
    }
}
