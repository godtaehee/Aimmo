import { getConnection, QueryRunner, Repository } from "typeorm";
import { PostNotFoundException } from '../exception/post_not_found_exception';
import { PermissionException } from '../exception/permission_exception';
import { UserNotFoundException } from '../exception/user_not_found_exception'
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

    async selectPost(postId): Promise<any> {
        const post = await this.postRepository
            .findOne(postId.id);
        if (post === undefined) {
            await this.queryRunner.release();
            throw new PostNotFoundException(String(postId));
        } else {
            await this.queryRunner.release();
            return post;
        }
    }

    async uploadPost(postInfo): Promise<any> {
        const { userId, text, title } = postInfo
        console.log(userId);
        const user = await this.userRepository
            .findOne(userId);
        if (user === undefined) {
            await this.queryRunner.release();
            throw new UserNotFoundException(String(userId));
        }
        await this.queryRunner.startTransaction();
        try {
            const postInfo = { title, text, user };
            const post = await this.postRepository.save(postInfo);
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
        console.log(title, text, postId, userId)
        const question = await this.postRepository
            .findOne(
                 postId

            );
        if (question === undefined) {
            const noAuthQuestion = await this.postRepository
                .findOne({ where: { id: postId } });
            if (noAuthQuestion !== undefined) {
                throw new PermissionException(String(postId));
            }
            else {
                throw new PostNotFoundException(String(postId));
            }
        }
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
        const question = await this.postRepository
            .findOne(
                postId

            );
        if (question === undefined) {
            const noAuthQuestion = await this.postRepository
                .findOne( postId);
            if (noAuthQuestion !== undefined) {
                await this.queryRunner.release();
                throw new PermissionException(String(postId));
            }
            else {
                await this.queryRunner.release();
                throw new PostNotFoundException(String(postId));
            }
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

}
