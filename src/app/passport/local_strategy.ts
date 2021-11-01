import passport from "passport";
import Strategy from "passport-local";
const LocalStrategy = Strategy;
import bcrypt from "bcrypt";

import { UserService } from "../service/user.service";

export default () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email: string, password: string, done) => {
                try {
                    const User = new UserService();
                    const exUser = await User.findUserByEmail(email);
                    if (exUser) {
                        const result = await bcrypt.compare(password, exUser.password);
                        if (result) {
                            return done(null, exUser);
                        } else {
                            return done(null, false, { message: "Password Invalid" });
                        }
                    } else {
                        return done(null, false, {
                            message: "Email Invalid",
                        });
                    }
                } catch (error) {
                    console.log(error);
                    return done(error);
                }
            }
        )
    );
};
