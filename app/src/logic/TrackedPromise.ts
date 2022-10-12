export class TrackedPromise<T> {
    private readonly _promise: Promise<T>;
    private _resolved: boolean = false;
    private _rejected: boolean = false;
    private _result: T|undefined = undefined;

    constructor(promise: Promise<T>) {
        this._promise = promise;
        promise.then(
            (result) => {
                this._result = result;
                this._resolved = true;
            },
            () => {
                this._rejected = true;
            },
        );
    }

    public get promise(): Promise<T> {
        return this._promise;
    }

    public get resolved(): boolean {
        return this._resolved;
    }

    public get rejected(): boolean {
        return this._rejected;
    }

    public get pending(): boolean {
        return !(this._rejected || this._resolved);
    }

    public get result(): T {
        if (this._rejected) {
            throw new Error('Promise was rejected.');
        }

        if (!this._resolved) {
            throw new Error('Promise is still pending.');
        }

        return this._result!;
    }
}

export function track<T>(promise: Promise<T>): TrackedPromise<T> {
    return new TrackedPromise<T>(promise);
}
