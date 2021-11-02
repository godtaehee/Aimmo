import express, { Request, Response, Router, NextFunction } from "express";
import { PageController } from "../controller/page.controller";
import { NestedCommentPageController } from "../controller/nested.comment.page.controller";
const router: Router = express.Router();
const controller: NestedCommentPageController =
  new NestedCommentPageController();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  await controller.page(req, res, next);
});

export const commentPageRouter: Router = router;
