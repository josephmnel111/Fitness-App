export class Server {
    public name: string | null = null;
    public socketUrl: string | null = null;
    public socketNamespace: string | null = null;

    constructor(obj?: {
        name: string;
        socketUrl: string;
        socketNamespace: string;
    } | Server) {
        if (obj) Object.assign(this, obj);
    }
}
