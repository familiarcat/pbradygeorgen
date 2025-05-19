/**
 * Result Pattern
 * 
 * This module provides a Result class for handling success and failure cases.
 * It's a more explicit alternative to throwing exceptions.
 */

/**
 * Result class for handling success and failure cases
 */
export class Result<T> {
  private constructor(
    public readonly success: boolean,
    public readonly data: T,
    public readonly error?: string
  ) {}

  /**
   * Create a success result
   * @param data The success data
   * @returns A success result
   */
  public static success<T>(data: T): Result<T> {
    return new Result<T>(true, data);
  }

  /**
   * Create a failure result
   * @param error The error message
   * @returns A failure result
   */
  public static failure<T>(error: string): Result<T> {
    return new Result<T>(false, null as T, error);
  }

  /**
   * Map the result to a new result
   * @param fn The mapping function
   * @returns A new result
   */
  public map<U>(fn: (data: T) => U): Result<U> {
    if (this.success) {
      return Result.success(fn(this.data));
    }
    return Result.failure(this.error!);
  }

  /**
   * Flat map the result to a new result
   * @param fn The mapping function
   * @returns A new result
   */
  public flatMap<U>(fn: (data: T) => Result<U>): Result<U> {
    if (this.success) {
      return fn(this.data);
    }
    return Result.failure(this.error!);
  }

  /**
   * Get the data or a default value
   * @param defaultValue The default value
   * @returns The data or the default value
   */
  public getOrElse(defaultValue: T): T {
    if (this.success) {
      return this.data;
    }
    return defaultValue;
  }

  /**
   * Get the data or throw an error
   * @returns The data
   * @throws Error if the result is a failure
   */
  public getOrThrow(): T {
    if (this.success) {
      return this.data;
    }
    throw new Error(this.error);
  }

  /**
   * Handle both success and failure cases
   * @param onSuccess The success handler
   * @param onFailure The failure handler
   * @returns The result of the handler
   */
  public fold<U>(onSuccess: (data: T) => U, onFailure: (error: string) => U): U {
    if (this.success) {
      return onSuccess(this.data);
    }
    return onFailure(this.error!);
  }
}
