import { Observable } from "rxjs";

export interface ReadOnlyBehaviorSubject<State> extends Observable<State> {
    get value(): State;
}
