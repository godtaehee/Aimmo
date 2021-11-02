import { Request, Response, NextFunction } from "express";
import { DecodedRequest } from "../definition/decoded_jwt";
import { HttpException } from "../exception/http_exception";
import { PostService } from "../service/post.service";
import { CommentService } from "../service/comment.service";

export class CommentController {
  private commentService: CommentService;

  public async createReply(
    req: DecodedRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const userId = req.decodedId;
    this.commentService = new CommentService();

    const { postId, depth, parentId, text } = req.body;
    try {
      const commentInfo = { postId, depth, parentId, text, userId };
      const result = await this.commentService.createReply(commentInfo);
      return res.status(200).json({
        result,
        message: "Upload Success",
      });
    } catch (error) {
      next(error);
    }
  }
}
