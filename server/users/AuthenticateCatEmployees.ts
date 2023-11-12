import {CatEmployeeCredentials} from "./CatEmployeeCredentials.js";
import {UnauthenticatedCatEmployee} from "./UnauthenticatedCatEmployee.js";

export default interface AuthenticateCatEmployees {
    authenticate(unauthenticatedCatEmployee: UnauthenticatedCatEmployee): Promise<CatEmployeeCredentials>
}