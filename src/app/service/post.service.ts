import { getConnection, QueryRunner, Repository } from "typeorm";
import { PostNotFoundException } from "../exception/post_not_found_exception";
import { PermissionException } from "../exception/permission_exception";
import { UserNotFoundException } from "../exception/user_not_found_exception";
import { Post } from "../entity/post";
import { User } from "../entity/user";

export class PostService {
  private queryRunner: QueryRunner;
  private userRepository: Repository<User>;
  private postRepository: Repository<Post>;

  constructor() {
    this.queryRunner = getConnection().createQueryRunner();
    this.userRepository = this.queryRunner.manager.getRepository(User);
    this.postRepository = this.queryRunner.manager.getRepository(Post);
  }

  async selectPost(requestInfo): Promise<any> {
    const post = await this.postRepository.findOne(requestInfo.id);
    if (post === undefined) {
      await this.queryRunner.release();
      throw new PostNotFoundException(String(requestInfo.id));
    } else {
      await this.queryRunner.release();
      if (!requestInfo.userId || !post.views?.includes(requestInfo.userId)) {
        if (requestInfo.userId) {
          post.views.push(requestInfo.userId);
        }
        post.count += 1;
        await this.postRepository.update(requestInfo.id, post);
        return post;
      }
      return post;
    }
  }

  async uploadPost(postInfo): Promise<any> {
    const { userId, text, title, category } = postInfo;
    const user = await this.userRepository.findOne(userId);
    if (user === undefined) {
      await this.queryRunner.release();
      throw new UserNotFoundException(String(userId));
    }
    await this.queryRunner.startTransaction();
    try {
      const postInfo = { title, text, category, userId, user };
      const test = this.postRepository.create(postInfo);
      const post = await this.postRepository.save(test);
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

  async updatePost(updateQuestionInfo): Promise<any> {
    const { title, text, postId, userId } = updateQuestionInfo;
    const question = await this.postRepository.findOne(postId);
    if (question.userId !== userId)
      throw new PermissionException(String(postId));
    await this.queryRunner.startTransaction();
    try {
      question.title = title || question.title;
      question.text = text || question.text;
      await this.postRepository.save(question);
      await this.queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async deletePost(deleteQuestionInfo): Promise<any> {
    const { postId, userId } = deleteQuestionInfo;
    const question = await this.postRepository.findOne(postId);
    if (question.userId !== userId) {
      throw new PermissionException(String(postId));
    }
    await this.queryRunner.startTransaction();
    try {
      await this.postRepository.remove(question);
      await this.queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async getByCondition(requestInfo) {
    const post = await this.postRepository.find({
      where: {
        $or: [
          {
            title: {
              $regex: `.*${requestInfo.title}.*`,
            },
          },
          {
            category: requestInfo.category,
          },
        ],
      },
    });

    if (post === undefined) {
      await this.queryRunner.release();
      throw new PostNotFoundException("찾을수없다.");
    } else {
      await this.queryRunner.release();
      return post;
    }
  }
}
