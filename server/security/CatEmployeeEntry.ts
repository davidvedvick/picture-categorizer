import AuthenticateCatEmployees from "./AuthenticateCatEmployees.js";
import {UnauthenticatedCatEmployee} from "./UnauthenticatedCatEmployee.js";
import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";
import {ManageCatEmployees} from "../users/ManageCatEmployees.js";
import Encoder from "./Encoder.js";
import DisabledCatEmployee from "./DisabledCatEmployee.js";

export default class CatEmployeeEntry implements AuthenticateCatEmployees {

    constructor(private readonly catEmployees: ManageCatEmployees, private readonly encoder: Encoder) {}

    async authenticate(unauthenticatedCatEmployee: UnauthenticatedCatEmployee): Promise<CatEmployeeCredentials> {
        let catEmployee = await this.catEmployees.findByEmail(unauthenticatedCatEmployee.email);
        if (!catEmployee) {
            catEmployee = await this.catEmployees.save({
                id: 0,
                email: unauthenticatedCatEmployee.email,
                password: this.encoder.encode(unauthenticatedCatEmployee.password),
                isEnabled: false,
            });
        }

        return new DisabledCatEmployee(
            catEmployee.id,
            catEmployee.email,
            catEmployee.password,
            catEmployee.isEnabled,
        );
    }
}