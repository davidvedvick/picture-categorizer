import CatEmployee from "../users/CatEmployee.js";

export default class DisabledCatEmployee implements CatEmployee {
    constructor(
        readonly id: number,
        readonly email: string,
        readonly password: string,
        readonly isEnabled: boolean) {
    }
}