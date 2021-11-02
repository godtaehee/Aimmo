import express, { Request, Response, Router, NextFunction } from "express";
import { PostController } from "../controller/post.controller";
import { authJwt } from "../middlewares/auth.middleware";
import { DecodedRequest } from "../definition/decoded_jwt";
import { CommentController } from "../controller/comment.controller";
const router: Router = express.Router();
const controller: CommentController = new CommentController();

router.post(
  "/",
  authJwt,
  async (req: DecodedRequest, res: Response, next: NextFunction) => {
    await controller.createReply(req, res, next);
  }
);

export const commentRouter: Router = router;
