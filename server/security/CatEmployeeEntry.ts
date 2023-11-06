import AuthenticateCatEmployees from "./AuthenticateCatEmployees.js";
import {UnauthenticatedCatEmployee} from "./UnauthenticatedCatEmployee.js";
import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";
import {ManageCatEmployees} from "../users/ManageCatEmployees.js";
import Encoder from "./Encoder.js";
import DisabledCatEmployee from "./DisabledCatEmployee.js";
import {AuthenticatedCatEmployee} from "./AuthenticatedCatEmployee.js";
import BadCatEmployeeCredentials from "./BadCatEmployeeCredentials.js";

export default class CatEmployeeEntry implements AuthenticateCatEmployees {

    constructor(private readonly catEmployees: ManageCatEmployees, private readonly encoder: Encoder) {}

    async authenticate(unauthenticatedCatEmployee: UnauthenticatedCatEmployee): Promise<CatEmployeeCredentials> {
        const { email, password: unauthenticatedPassword } = unauthenticatedCatEmployee;

        let catEmployee = await this.catEmployees.findByEmail(email);
        if (!catEmployee) {
            catEmployee = await this.catEmployees.save({
                id: 0,
                email: email,
                password: this.encoder.encode(unauthenticatedPassword),
                isEnabled: false,
            });
        }

        if (!catEmployee.password || catEmployee.password == "") {
            throw new BadCatEmployeeCredentials(email, unauthenticatedPassword);
        }

        if (!catEmployee.isEnabled) {
            return new DisabledCatEmployee(catEmployee.email, unauthenticatedPassword);
        }

        return this.encoder.matches(unauthenticatedPassword, catEmployee.password)
            ? new AuthenticatedCatEmployee(catEmployee.email, unauthenticatedPassword)
            : new UnauthenticatedCatEmployee(catEmployee.email, unauthenticatedPassword);
    }
}