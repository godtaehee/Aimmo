import { Base } from "./base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class Comment extends Base {
  @BeforeInsert()
  initValue() {}

  @Column()
  postId: string;

  @Column()
  depth: number;

  @Column()
  parentId: string;

  @Column()
  userId: string;

  @Column()
  text: string;
}
