export function resolved<T>(promise: Promise<T>): boolean {
    let result = false;
    promise.then(() => {
        result = true;
    });
    return result;
}
