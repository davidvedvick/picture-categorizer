import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";

export class AuthenticatedCatEmployee implements CatEmployeeCredentials {
    constructor(readonly email: string, readonly password: string) {}
}