import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import {JwtToken} from "./JwtToken.js";

export interface ManageJwtTokens {
    generateToken(authenticatedEmployee: AuthenticatedCatEmployee): Promise<JwtToken | null>

    decodeToken(token: string): Promise<AuthenticatedCatEmployee | null>
}