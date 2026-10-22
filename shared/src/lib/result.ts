/**
 * Represents a computation that either succeeded with a value of type T,
 * or failed with an error of type E.
 */
export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

/**
 * Creates a successful Result wrapping the provided value.
 *
 * @template T Type of the success value.
 * @template E Type of the error (defaults to never).
 * @param value The value indicating successful outcome.
 * @returns A Result with ok: true and the supplied value.
 */
export function ok<T, E = never>(value: T): Result<T, E> {
  return { ok: true, value };
}

/**
 * Creates an error Result wrapping the provided error.
 *
 * @template E Type of the error.
 * @template T Type of the success value (defaults to never).
 * @param error The error descriptor or instance.
 * @returns A Result with ok: false and the supplied error.
 */
export function err<E, T = never>(error: E): Result<T, E> {
  return { ok: false, error };
}

/**
 * Type guard checking whether a Result is a success.
 *
 * @template T Success value type.
 * @template E Error value type.
 * @param result The Result instance to check.
 * @returns True if result.ok is true, narrowing the type.
 */
export function isOk<T, E>(
  result: Result<T, E>
): result is { readonly ok: true; readonly value: T } {
  return result.ok;
}

/**
 * Type guard checking whether a Result is an error.
 *
 * @template T Success value type.
 * @template E Error value type.
 * @param result The Result instance to check.
 * @returns True if result.ok is false, narrowing the type.
 */
export function isErr<T, E>(
  result: Result<T, E>
): result is { readonly ok: false; readonly error: E } {
  return !result.ok;
}

/**
 * Transforms the value of a successful Result using the provided mapping function.
 * If the Result is an error, it is returned unchanged.
 *
 * @template T Input success value type.
 * @template U Output success value type.
 * @template E Error value type.
 * @param result The input Result.
 * @param fn Mapping function applied only if result.ok is true.
 * @returns A new Result with the transformed value or original error.
 */
export function map<T, U, E>(result: Result<T, E>, fn: (val: T) => U): Result<U, E> {
  if (result.ok) {
    return ok(fn(result.value));
  }
  return err(result.error);
}

/**
 * Transforms the error of an error Result using the provided mapping function.
 * If the Result is successful, it is returned unchanged.
 *
 * @template T Success value type.
 * @template E Input error value type.
 * @template F Output error value type.
 * @param result The input Result.
 * @param fn Mapping function applied only if result.ok is false.
 * @returns A new Result with the original value or transformed error.
 */
export function mapErr<T, E, F>(result: Result<T, E>, fn: (errVal: E) => F): Result<T, F> {
  if (result.ok) {
    return ok(result.value);
  }
  return err(fn(result.error));
}

/**
 * Extracts the value of a successful Result, or returns the fallback value on error.
 *
 * @template T Success value type.
 * @template E Error value type.
 * @param result The input Result.
 * @param fallback Value returned if result is an error.
 * @returns The inner value if ok, else fallback.
 */
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  if (result.ok) {
    return result.value;
  }
  return fallback;
}
