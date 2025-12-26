export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;

    // Required for extending built-in classes
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
