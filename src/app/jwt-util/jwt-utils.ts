import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserService } from "../service/user.service"
dotenv.config();
export class Jwt {
    private secret;

    constructor() {
        this.secret = process.env.TOKEN_SECRET_KEY;
    }

    public accessSign(user): Promise<any> {
        const payload = {
            id: user.id,
        };
        return jwt.sign(payload, this.secret, {
            expiresIn: "5m",
        });
    }

    public accessVerify(access_token: string) {
        let decoded = null;
        try {
            decoded = jwt.verify(access_token, this.secret);
            return {
                ok: true,
                id: decoded.id,
            };
        } catch (error) {
            return {
                ok: false,
                message: error.message,
            };
        }
    }

    public refreshSign() {
        return jwt.sign({}, this.secret, {
            expiresIn: "14d",
        });
    }

    public async refreshVerify(refresh_token, userId) {
        const userService = new UserService();
        const exUser = await userService.findUserById(userId);
        try {
            if (refresh_token === exUser.token) {
                try {
                    jwt.verify(refresh_token, this.secret);
                    return true;
                } catch (err) {
                    console.log(err.message);
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
}
