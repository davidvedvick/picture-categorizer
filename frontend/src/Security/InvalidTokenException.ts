import {ExpiringJwtToken} from "./ExpiringJwtToken";

export class InvalidTokenException extends Error {
    constructor(readonly token: ExpiringJwtToken | null | undefined) {
        super(`The token ${token} was invalid.`);
    }
}