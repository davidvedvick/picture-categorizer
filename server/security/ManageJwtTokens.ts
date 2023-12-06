import {AuthenticatedCatEmployee} from "../users/AuthenticatedCatEmployee.js";
import {JwtToken} from "../../transfer/JwtToken.js";
import {DecodedCatEmployee} from "../users/DecodedCatEmployee.js";

export interface ManageJwtTokens {
    generateToken(authenticatedEmployee: AuthenticatedCatEmployee): Promise<JwtToken | null>

    decodeToken(token: string): Promise<DecodedCatEmployee | null>
}