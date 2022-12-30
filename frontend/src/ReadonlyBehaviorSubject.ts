import {Observable} from "rxjs";

export interface ReadonlyBehaviorSubject<State> extends Observable<State> {
    get value(): State;
}