import { Response, NextFunction } from "express";
import { Jwt } from "../jwt-util/jwt-utils";
import { DecodedRequest } from "../definition/decoded_jwt";

export const viewDuplicateJwt = (
  req: DecodedRequest,
  res: Response,
  next: NextFunction
) => {
  const jwt = new Jwt();
  const access_token = req.cookies.authorization;
  if (!access_token) {
    next();
  } else {
    const result = jwt.accessVerify(access_token);
    req.decodedId = result.id;
    next();
  }
};
