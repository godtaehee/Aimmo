import { Request, Response, NextFunction } from "express";
import { PageService } from "../service/page.service";
import { HttpException } from "../exception/http_exception";

export class PageController {
  private pageService: PageService;
  public async page(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    this.pageService = new PageService();
    const limit = Number(req.query.limit);
    const offset = req.query.offset;
    const pageInfo = { limit, offset };
    try {
      const postList = await this.pageService.getPostList(pageInfo);
      return res.status(200).json({
        list: postList.postList,
        // totalCount: postList.postCount,
      });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  }
}
