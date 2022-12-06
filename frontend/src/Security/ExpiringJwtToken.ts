export class ExpiringJwtToken {
    constructor(readonly token: string, readonly expiresAt: number) {
    }
}