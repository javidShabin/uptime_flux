export class SummaryError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "SummaryError";
  }
}

