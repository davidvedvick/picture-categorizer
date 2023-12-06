import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";

export class AuthenticatedCatEmployee implements CatEmployeeCredentials {
    constructor(readonly catEmployeeId: number, readonly email: string, readonly password: string) {}
}