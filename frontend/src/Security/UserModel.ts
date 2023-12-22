import { User } from "./User";
import { ServeAuthentication } from "./ServeAuthentication";
import { ReadOnlyBehaviorSubject } from "../ReadOnlyBehaviorSubject";
import { BehaviorSubject } from "rxjs";
import { instance as auth } from "../Security/AuthorizationService";
import { InvalidTokenException } from "./InvalidTokenException";
import { JwtToken } from "../../../transfer/JwtToken";

interface UserModel {
    get isLoggedIn(): ReadOnlyBehaviorSubject<boolean>;

    get catEmployeeId(): ReadOnlyBehaviorSubject<number | null>;

    authenticate(user: User): Promise<JwtToken | null>;
}

class UserViewModel implements UserModel {
    private readonly isLoggedInSubject: BehaviorSubject<boolean>;
    private readonly catEmployeeIdSubject: BehaviorSubject<number | null>;

    constructor(private readonly authentication: ServeAuthentication) {
        this.isLoggedInSubject = new BehaviorSubject(authentication.isLoggedIn());
        this.catEmployeeIdSubject = new BehaviorSubject(authentication.getUserToken()?.catEmployeeId ?? null);
    }

    get catEmployeeId(): ReadOnlyBehaviorSubject<number | null> {
        return this.catEmployeeIdSubject;
    }

    async authenticate(user: User): Promise<JwtToken | null> {
        const token = await this.authentication.authenticate(user);
        this.catEmployeeIdSubject.next(token?.catEmployeeId ?? null);
        this.isLoggedInSubject.next(token != null);
        return token;
    }

    async fetchAuthenticated(input: RequestInfo | URL, init?: RequestInit) {
        const jwtToken = this.authentication.getUserToken();
        if (!jwtToken?.catEmployeeId) {
            this.logOut();
            throw new InvalidTokenException(jwtToken);
        }

        const authHeader = { Authorization: `Bearer ${jwtToken.token}` };

        const authInit = init
            ? Object.assign(init, { headers: init.headers ? Object.assign(init?.headers, authHeader) : authHeader })
            : { headers: authHeader };
        const response = await fetch(input, authInit);

        if (response.status === 401) {
            this.logOut();
            throw new InvalidTokenException(jwtToken);
        }

        return response;
    }

    get isLoggedIn(): ReadOnlyBehaviorSubject<boolean> {
        return this.isLoggedInSubject;
    }

    private logOut() {
        this.authentication.logOut();
        this.catEmployeeIdSubject.next(null);
        this.isLoggedInSubject.next(false);
    }
}

let internalInstance: UserViewModel;

function instance(): UserViewModel {
    if (!internalInstance) internalInstance = new UserViewModel(auth());
    return internalInstance;
}

export function userModel(): UserModel {
    return instance();
}

export function fetchAuthenticated(input: RequestInfo | URL, init?: RequestInit) {
    return instance().fetchAuthenticated(input, init);
}
