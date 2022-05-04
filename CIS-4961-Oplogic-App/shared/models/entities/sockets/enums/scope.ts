export enum Scope {
    id = 'id:',
    info = 'info:',
    settings = 'settings:',

    channel = 'channel:',
    membership = 'membership:',
    message = 'message:',
    file = 'file:',

    me = 'me:',
    group = 'group:',
    dm = 'dm:',

    user = 'user:',
    customer = 'customer:',
    reference = 'reference:',
}

export namespace Scope {
    export function getScopes(event: string): string[] {
        let lastScopePos = event.lastIndexOf(':');
        if (lastScopePos < 0) {
            return [];
        }

        let scopes = event.slice(0, lastScopePos).split(':');
        let parsedScopes: string[] = [];
        scopes.forEach((scope) => {
            let parsedScope = scope.trim().replace(':', '');

            if (parsedScope != '') {
                parsedScopes.push(parsedScope);
            }
        });

        return parsedScopes;
    }
}
