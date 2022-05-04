export class Audit {
    public id: number | null = null;
    public auditMessageId: number | null = null;
    public auditChangedById: number | null = null;
    public oldValue: string | null = null;
    public newValue: string | null = null;
    public changeDate: Date | null = new Date();

    constructor(
        obj?:
            | {
                  id?: number;
                  auditMessageId: number;
                  auditChangedById: number;
                  oldValue: string;
                  newValue: string;
                  changeDate?: Date;
              }
            | Audit
    ) {
        if (obj) Object.assign(this, obj);
        if (obj?.changeDate) {
            this.changeDate = new Date(obj.changeDate);
        }
    }

    public static ensureDateType(audits: Audit[]): Audit[] {
        if (!audits) {
            return [];
        }

        for (let audit of audits) {
            if (audit.changeDate && !(audit.changeDate instanceof Date)) {
                audit.changeDate = new Date(audit.changeDate);
            }
        }

        return audits;
    }
}
