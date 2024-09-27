/**
 * A utility class for retrying asynchronous operations.
 * Support's indefinite or set number of retries and a custom delay time in ms.
 */
class Getry {
  /**
   * Creates a generator of inifinite number of promises that retry the given operation with a delay.
   * Returns T or propagates the error.
   */
  public static *generate<T>(
    operation: () => Promise<T>,
    delay = 1000
  ): Generator<Promise<T>, Promise<T>, unknown> {
    for (let i = 0; i < Number.POSITIVE_INFINITY; i++) {
      yield new Promise<T>((resolve, reject) => {
        operation()
          .then(resolve)
          .catch((error) => {
            setTimeout(() => reject(error), delay);
          });
      });
    }

    /* needed for TS to not infer void return type */
    /* safe since we are always yielding indefinitely */
    /* this code will never be reached */
    return undefined as unknown as Promise<T>;
  }

  /**
   * Retries promises yielded by a generator up to a specified number of attempts.
   * Catches errors until the last iteration.
   * Returns the result of the first successful promise T or rethrows the last error if all attempts fail.
   */
  public static async iterate<T>(
    generator: Generator<Promise<T>, Promise<T>, unknown>,
    attempts: number
  ) {
    for (let i = 0; i < attempts; i++) {
      const promise = generator.next().value;

      try {
        /* Result will be of type Awaited<T> */
        return await promise;
      } catch (error) {
        /* Rethrow error if last attempt fails */
        if (i === attempts - 1) {
          throw error;
        }
      }
    }

    /* Throw if no success after all retries */
    throw new Error("All retry attempts failed");
  }
}

export { Getry };
