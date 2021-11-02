import { Base } from "./base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class Comment extends Base {
  @BeforeInsert()
  initValue() {
    this.depth = 1;
    this.parentId = null;
  }

  @Column()
  postId: number;

  @Column()
  depth: number;

  @Column()
  parentId: string;

  @Column()
  author: string;

  @Column()
  text: string;
}
