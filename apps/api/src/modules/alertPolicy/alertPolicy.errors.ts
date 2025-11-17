export class AlertPolicyError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AlertPolicyError";
  }
}

