import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";

export class UnauthenticatedCatEmployee implements CatEmployeeCredentials {
    constructor(readonly email: string, readonly password: string) {}
}