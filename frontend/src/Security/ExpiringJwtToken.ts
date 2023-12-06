
export class ExpiringJwtToken {
    constructor(
        readonly catEmployeeId: number,
        readonly token: string,
        readonly expiresAt: number) {}
}