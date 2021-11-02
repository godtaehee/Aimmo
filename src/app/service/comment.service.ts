import { getConnection, QueryRunner, Repository } from "typeorm";
import { Post } from "../entity/post";
import { Comment } from "../entity/comment";
import { UserNotFoundException } from "../exception/user_not_found_exception";
import { User } from "../entity/user";
import { PostNotFoundException } from "../exception/post_not_found_exception";

export class CommentService {
  private queryRunner: QueryRunner;
  private commentRepository: Repository<Comment>;
  private postRepository: Repository<Post>;
  private userRepository: Repository<User>;

  constructor() {
    this.queryRunner = getConnection().createQueryRunner();
    this.userRepository = this.queryRunner.manager.getRepository(User);
    this.postRepository = this.queryRunner.manager.getRepository(Post);
    this.commentRepository = getConnection().getRepository(Comment);
  }

  async createReply(commentInfo) {
    const { postId, depth, parentId, text, userId } = commentInfo;
    const user = await this.userRepository.findOne(userId);
    if (user === undefined) {
      await this.queryRunner.release();
      throw new UserNotFoundException(String(userId));
    }

    await this.queryRunner.startTransaction();
    try {
      const post = await this.postRepository.findOne(postId);
      if (post === undefined) {
        await this.queryRunner.release();
        throw new PostNotFoundException(String(postId));
      }
      const commentInfo = { postId, depth, parentId, text, userId };

      const test = this.commentRepository.create(commentInfo);
      const result = await this.commentRepository.save(test);
      post.comments.push(result);
      await this.postRepository.update(postId, post);
      await this.queryRunner.commitTransaction();
      return post;
    } catch (error) {
      console.error(error);
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }
}
