import {JwtToken} from "./JwtToken";
import {ExpiringJwtToken} from "./ExpiringJwtToken";
import {User} from "./User";
import {ServeAuthentication} from "./ServeAuthentication";

const jwtTokenKey = "jwtToken";

export class AuthorizationService implements ServeAuthentication {
    constructor(private readonly storage: Storage) {}

    async authenticate(user: User): Promise<JwtToken | null> {
        const response = await fetch(
            "/api/login",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

        if (!response.ok) return null;

        const jwtToken = await response.json() as JwtToken;
        if (!jwtToken) return null;

        const expiringToken = new ExpiringJwtToken(jwtToken.token, Date.now() + jwtToken.expiresInMs)
        this.storage.setItem(jwtTokenKey, JSON.stringify(expiringToken))
        return jwtToken;
    }

    getUserToken(): ExpiringJwtToken | null {
        const stringToken = this.storage.getItem(jwtTokenKey);
        if (!stringToken) return null;
        return JSON.parse(stringToken);
    }

    isLoggedIn(): boolean {
        const userToken = this.getUserToken();
        return (userToken && userToken.expiresAt >= Date.now()) ?? false;
    }

    logOut() {
        this.storage.removeItem(jwtTokenKey);
    }
}

let internalInstance: AuthorizationService

export const instance = () => {
    if (!internalInstance)
        internalInstance = new AuthorizationService(localStorage);
    return internalInstance;
}