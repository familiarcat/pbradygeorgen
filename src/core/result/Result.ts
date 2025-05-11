/**
 * Result Pattern Implementation
 * 
 * This module implements the Result pattern for error handling.
 * It provides a way to represent either a successful result or an error
 * without throwing exceptions.
 */

/**
 * Result type that can either be a success or an error
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Success result containing a value
 */
export interface Success<T> {
  success: true;
  value: T;
}

/**
 * Failure result containing an error
 */
export interface Failure<E> {
  success: false;
  error: E;
}

/**
 * Create a success result
 * 
 * @param value The success value
 * @returns A success result
 */
export function ok<T>(value: T): Success<T> {
  return { success: true, value };
}

/**
 * Create a failure result
 * 
 * @param error The error
 * @returns A failure result
 */
export function err<E>(error: E): Failure<E> {
  return { success: false, error };
}

/**
 * Safely execute a function that might throw an exception
 * and return a Result
 * 
 * @param fn The function to execute
 * @returns A Result containing either the function's return value or the caught error
 */
export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Safely execute an async function that might throw an exception
 * and return a Result
 * 
 * @param fn The async function to execute
 * @returns A Promise of a Result containing either the function's return value or the caught error
 */
export async function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Map a Result's success value to a new value
 * 
 * @param result The result to map
 * @param fn The mapping function
 * @returns A new Result with the mapped value or the original error
 */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (result.success) {
    return ok(fn(result.value));
  }
  return result;
}

/**
 * Map a Result's error to a new error
 * 
 * @param result The result to map
 * @param fn The mapping function
 * @returns A new Result with the original value or the mapped error
 */
export function mapError<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  if (!result.success) {
    return err(fn(result.error));
  }
  return result;
}

/**
 * Chain Results together
 * 
 * @param result The result to chain
 * @param fn The function to apply to the success value
 * @returns A new Result from the function or the original error
 */
export function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  if (result.success) {
    return fn(result.value);
  }
  return result;
}

/**
 * Get the value from a Result or a default value if it's an error
 * 
 * @param result The result
 * @param defaultValue The default value to use if the result is an error
 * @returns The success value or the default value
 */
export function getValueOrDefault<T>(result: Result<T, any>, defaultValue: T): T {
  return result.success ? result.value : defaultValue;
}

/**
 * Get the value from a Result or throw the error if it's an error
 * 
 * @param result The result
 * @returns The success value
 * @throws The error if the result is an error
 */
export function getValueOrThrow<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.value;
  }
  throw result.error;
}

/**
 * Combine multiple Results into a single Result containing an array of values
 * 
 * @param results The results to combine
 * @returns A Result containing an array of values or the first error
 */
export function all<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (!result.success) {
      return result;
    }
    values.push(result.value);
  }
  return ok(values);
}

export default {
  ok,
  err,
  tryCatch,
  tryCatchAsync,
  map,
  mapError,
  flatMap,
  getValueOrDefault,
  getValueOrThrow,
  all
};
