import { HttpException } from "./http_exception";

export class AuthException extends HttpException {
    constructor(message: string) {
        super(401, `${message}`);
    }
}