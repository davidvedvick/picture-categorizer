import {User} from "./User";
import {JwtToken} from "./JwtToken";
import {ExpiringJwtToken} from "./ExpiringJwtToken";

export interface ServeAuthentication {
    authenticate(user: User): Promise<JwtToken | null>;
    getUserToken(): ExpiringJwtToken | null;
    isLoggedIn(): boolean;
    logOut(): void;
}