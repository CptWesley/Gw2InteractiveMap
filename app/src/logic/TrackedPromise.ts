export class TrackedPromise<T> {
    private readonly _promise: Promise<T>;
    private _resolved: boolean = false;
    private _rejected: boolean = false;
    private _result: T|undefined = undefined;
    private _error: any = undefined;

    constructor(promise: Promise<T>) {
        this._promise = promise;
        promise.then(
            (result) => {
                this._result = result;
                this._resolved = true;
            },
            (error) => {
                this._error = error;
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

    public get error(): any {
        if (this._resolved) {
            throw new Error('Promise was resolved.');
        }

        if (!this._rejected) {
            throw new Error('Promise is still pending.');
        }

        return this._error;
    }

    public nowOrThen(onResolved?: (result: T) => void, onRejected?: (error: any) => void): TrackedPromise<T> {
        return this.now(onResolved, onRejected).then(onResolved, onRejected);
    }

    public now(onResolved?: (result: T) => void, onRejected?: (error: any) => void): TrackedPromise<T> {
        if (this._resolved && onResolved) {
            onResolved(this._result!);
        }

        if (this._rejected && onRejected) {
            onRejected(this._error);
        }

        return this;
    }

    public then(onResolved?: (result: T) => void, onRejected?: (error: any) => void): TrackedPromise<T> {
        if (!this._resolved && !this._rejected) {
            this._promise.then(onResolved, onRejected);
        }

        return this;
    }
}

export function track<T>(promise: Promise<T>): TrackedPromise<T> {
    return new TrackedPromise<T>(promise);
}
