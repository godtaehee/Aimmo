import { Request, Response, NextFunction } from 'express';
import { DecodedRequest } from '../definition/decoded_jwt'
import { HttpException } from '../exception/http_exception';
import { PostService } from "../service/post.service";

export class PostController {

  private postService: PostService;

  public async get(req: Request, res: Response, next: NextFunction): Promise<any> {
    const postId: number = Number(req.query.id);
    this.postService = new PostService();
    try {
      const exPost = await this.postService.selectPost({ id: postId });
      return res.status(200).json({
        data: exPost
      })
    } catch (error) {
      next(error)
    }
  }
  public async post(req: DecodedRequest, res: Response, next: NextFunction): Promise<any> {
    const userId: number = req.decodedId;
    this.postService = new PostService();
    const { title, text } = req.body;
    try {
      const postInfo = { userId, text, title }
      const result = await this.postService.uploadPost(postInfo);
      console.log(result.id)
      return res.status(200).json({
        boardId: result.id,
        message: "Upload Success"
      })
    }
    catch (error) {
      next(error)
    }
  }

  public async delete(req: DecodedRequest, res: Response, next: NextFunction): Promise<any> {
    const postId: number = Number(req.query.id);
    const userId: number = req.decodedId;
    this.postService = new PostService();
    try {
      const postInfo = { userId, postId };
      const exPost = await this.postService.deletePost(postInfo);
      return res.status(200).json({
        message: "Delete Success"
      })
    } catch (error) {
      next(error)
    }
  }
  public async patch(req: DecodedRequest, res: Response, next: NextFunction): Promise<any> {
    const postId = req.query.id;
    const userId  = req.decodedId;
    this.postService = new PostService();
    const { text, title } = req.body;
    try {
      const postInfo = { postId, text, title, userId }
      const exPost = await this.postService.updatePost(postInfo);
      return res.status(200).json({
        message: "Update Success"
      })
    } catch (error) {
      next(error)
    }
  }

}
