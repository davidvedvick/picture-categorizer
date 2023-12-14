export type CancellationToken = {
    get isCancelled(): boolean,
    cancel(): void,
    promisedCancellation: Promise<unknown>,
}

export function cancellationToken(): CancellationToken {
    let isCancelledState = false;
    let resolver: (value: (PromiseLike<unknown> | unknown)) => void = () => {};

    return {
        get isCancelled() {
            return isCancelledState;
        },
        cancel() {
            resolver(null);
            isCancelledState = true;
        },
        promisedCancellation: new Promise(resolve => {
            resolver = resolve;
        }),
    };
}