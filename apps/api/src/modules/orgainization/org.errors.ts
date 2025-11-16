export class OrgError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "OrgError";
  }
}