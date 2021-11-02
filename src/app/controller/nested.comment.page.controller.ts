import { Request, Response, NextFunction } from "express";
import { PageService } from "../service/page.service";
import { HttpException } from "../exception/http_exception";
import { NestedCommentPageService } from "../service/nested.comment.page.service";

export class NestedCommentPageController {
  private nestedCommentPageService: NestedCommentPageService;
  public async page(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    this.nestedCommentPageService = new NestedCommentPageService();
    const limit = Number(req.query.limit);
    const offset = req.query.offset;
    const pageInfo = { limit, offset };
    try {
      const commentList = await this.nestedCommentPageService.getCommentList(
        pageInfo
      );
      return res.status(200).json({
        list: commentList.commentList,
      });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }
}
