import {User} from "./User";
import {ExpiringJwtToken} from "./ExpiringJwtToken";
import {JwtToken} from "../../../transfer/JwtToken";

export interface ServeAuthentication {
    authenticate(user: User): Promise<JwtToken | null>;
    getUserToken(): ExpiringJwtToken | null;
    isLoggedIn(): boolean;
    logOut(): void;
}