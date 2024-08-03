import React from "react";
import { BehaviorSubject, Observable, Observer, Subscribable, SubscriptionLike } from "rxjs";

export interface InteractionState<State> extends Subscribable<State> {
    get value(): State;
}

export interface UpdatableInteractionState<State> extends InteractionState<State> {
    set value(state: State);
}

class MutableInteractionState<T> extends BehaviorSubject<T> implements UpdatableInteractionState<T> {
    constructor(initialValue: T) {
        super(initialValue);
    }

    get value(): T {
        return this.getValue();
    }

    set value(value: T) {
        this.next(value);
    }
}

class LiftedInteractionState<T> extends BehaviorSubject<T> implements InteractionState<T>, Observer<T> {
    constructor(observable: Observable<T>, initialValue: T) {
        super(initialValue);
        observable.subscribe(this);
    }
}

export function liftInteractionState<T>(
    observable: Observable<T>,
    initialValue: T,
): Observable<T> & InteractionState<T> & SubscriptionLike {
    return new LiftedInteractionState(observable, initialValue);
}

export function mutableInteractionState<T>(
    initialValue: T,
): Observable<T> & UpdatableInteractionState<T> & SubscriptionLike {
    return new MutableInteractionState(initialValue);
}

export function useInteractionState<T>(interactionState: InteractionState<T>): T {
    const [state, setState] = React.useState(interactionState.value);

    React.useEffect(() => {
        const sub = interactionState.subscribe({ next: setState });
        return () => sub.unsubscribe();
    }, [interactionState]);

    return state;
}
