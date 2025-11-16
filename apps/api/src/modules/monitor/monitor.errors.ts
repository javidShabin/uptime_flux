export class MonitorError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = "MonitorError";
    }
}