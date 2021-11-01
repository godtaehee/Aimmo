import { HttpException } from "./http_exception";

export class PostNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Post ${id}  not found`);
    }
}