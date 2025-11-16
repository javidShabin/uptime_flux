export class MemberError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "MemberError";
  }
}