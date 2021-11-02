import { getConnection, QueryRunner, Repository } from "typeorm";
import { ObjectID } from "mongodb";
import { Post } from "../entity/post";
import { User } from "../entity/user";
import { Comment } from "../entity/comment";

export class NestedCommentPageService {
  private commentRepository: Repository<Comment>;
  private queryRunner: QueryRunner;
  private lastId: string;
  constructor() {
    this.queryRunner = getConnection().createQueryRunner();
    this.commentRepository = this.queryRunner.manager.getRepository(Comment);
  }

  async getCommentList(pageInfo) {
    let commentList = await this.commentRepository.find({
      take: pageInfo.limit,
      where: {
        depth: 1,
      },
      order: {
        created_at: "DESC",
      },
    });
    if (pageInfo.offset !== "0") {
      commentList = await this.commentRepository.find({
        take: pageInfo.limit,
        where: {
          _id: { $lt: new ObjectID(pageInfo.offset) },
          depth: 1,
        },
        order: {
          created_at: "DESC",
        },
      });
    }
    this.lastId = commentList[commentList.length - 1].id.toString();

    return { commentList: commentList };
  }
}
