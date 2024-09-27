/**
 * A utility class for retrying asynchronous operations.
 * Support's indefinite or set number of retries and a custom delay time in ms.
 */
declare class Getry {
    /**
     * Creates a generator of inifinite number of promises that retry the given operation with a delay.
     * Returns T or propagates the error.
     */
    static generate<T>(operation: () => Promise<T>, delay?: number): Generator<Promise<T>, Promise<T>, unknown>;
    /**
     * Retries promises yielded by a generator up to a specified number of attempts.
     * Catches errors until the last iteration.
     * Returns the result of the first successful promise T or rethrows the last error if all attempts fail.
     */
    static iterate<T>(generator: Generator<Promise<T>, Promise<T>, unknown>, attempts: number): Promise<T>;
}

export { Getry };
