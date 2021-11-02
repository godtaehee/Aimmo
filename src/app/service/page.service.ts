import { getConnection, QueryRunner, Repository } from "typeorm";
import { ObjectID } from "mongodb";
import { Post } from "../entity/post";
import { User } from "../entity/user";

export class PageService {
  private postRepository: Repository<Post>;
  private queryRunner: QueryRunner;
  private lastId: string;
  constructor() {
    this.queryRunner = getConnection().createQueryRunner();
    this.postRepository = this.queryRunner.manager.getRepository(Post);
  }

  async getPostList(pageInfo) {
    let postList = await this.postRepository.find({
      take: pageInfo.limit,
    });
    if (pageInfo.offset !== "0") {
      postList = await this.postRepository.find({
        take: pageInfo.limit,
        where: {
          _id: { $gt: new ObjectID(pageInfo.offset) },
        },
      });
    }
    this.lastId = postList[postList.length - 1].id.toString();

    return { postList };
  }
}
