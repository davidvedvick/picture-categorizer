import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";

export default class DisabledCatEmployee implements CatEmployeeCredentials {
    constructor(readonly email: string, readonly password: string) {}
}