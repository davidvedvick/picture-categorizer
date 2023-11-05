export class UnknownCatEmployeeException extends Error {
    constructor(email: string) {
        super(`An employee with ${email} was not found.`);
    }
}