import { User } from "./User";
import { ServeAuthentication } from "./ServeAuthentication";
import { instance as auth } from "../Security/AuthorizationService";
import { InvalidTokenException } from "./InvalidTokenException";
import { JwtToken } from "../../../transfer/JwtToken";
import { InteractionState, mutableInteractionState, UpdatableInteractionState } from "../interactions/InteractionState";

interface UserModel {
    get isLoggedIn(): InteractionState<boolean>;

    get catEmployeeId(): InteractionState<number | null>;

    authenticate(user: User): Promise<JwtToken | null>;
}

export interface AuthenticatedFetch {
    fetchAuthenticated(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

class UserViewModel implements UserModel, AuthenticatedFetch {
    private readonly isLoggedInSubject: UpdatableInteractionState<boolean>;
    private readonly catEmployeeIdSubject: UpdatableInteractionState<number | null>;

    constructor(private readonly authentication: ServeAuthentication) {
        this.isLoggedInSubject = mutableInteractionState(authentication.isLoggedIn());
        this.catEmployeeIdSubject = mutableInteractionState(authentication.getUserToken()?.catEmployeeId ?? null);
    }

    get catEmployeeId(): InteractionState<number | null> {
        return this.catEmployeeIdSubject;
    }

    async authenticate(user: User): Promise<JwtToken | null> {
        const token = await this.authentication.authenticate(user);
        this.catEmployeeIdSubject.value = token?.catEmployeeId ?? null;
        this.isLoggedInSubject.value = token != null;
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

    get isLoggedIn(): InteractionState<boolean> {
        return this.isLoggedInSubject;
    }

    private logOut() {
        this.authentication.logOut();
        this.catEmployeeIdSubject.value = null;
        this.isLoggedInSubject.value = false;
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

export function authenticatedFetcher(): AuthenticatedFetch {
    return instance();
}

export function fetchAuthenticated(input: RequestInfo | URL, init?: RequestInit) {
    return instance().fetchAuthenticated(input, init);
}
