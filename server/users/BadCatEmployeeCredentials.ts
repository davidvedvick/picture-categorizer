export default class BadCatEmployeeCredentials extends Error {
    constructor(readonly email: string, readonly password: string) {
        super();
    }
}