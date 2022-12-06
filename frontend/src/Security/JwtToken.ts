export interface JwtToken {
    readonly token: string;
    readonly expiresInMs: number;
}