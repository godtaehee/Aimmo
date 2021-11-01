import { HttpException } from "./http_exception";

export class UserNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, ` User ${id} not found`);
    }
}