import {EmailIdentifiedCatEmployee} from "./EmailIdentifiedCatEmployee.js";

export class DecodedCatEmployee implements EmailIdentifiedCatEmployee {
    constructor(readonly email: string) {}
}