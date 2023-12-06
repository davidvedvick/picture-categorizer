import AuthenticateCatEmployees from "./AuthenticateCatEmployees.js";
import {UnauthenticatedCatEmployee} from "./UnauthenticatedCatEmployee.js";
import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";
import {ManageCatEmployees} from "./ManageCatEmployees.js";
import Encoder from "../security/Encoder.js";
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
                password: await this.encoder.encode(unauthenticatedPassword),
                isEnabled: false,
            });
        }

        if (!catEmployee.password || catEmployee.password == "") {
            throw new BadCatEmployeeCredentials(email, unauthenticatedPassword);
        }

        const hashedPassword = catEmployee.password;

        if (!catEmployee.isEnabled) {
            return new DisabledCatEmployee(email, hashedPassword);
        }

        return await this.encoder.matches(unauthenticatedPassword, hashedPassword)
            ? new AuthenticatedCatEmployee(catEmployee.id, email, hashedPassword)
            : new UnauthenticatedCatEmployee(email, hashedPassword);
    }
}