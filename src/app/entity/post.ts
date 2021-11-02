import { Base } from "./base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import { Comment } from "./comment";

const BOARD_CATEGORY = {
  WEB: "WEB",
  APP: "APP",
  GAME: "GAME",
  ALGORITHM: "ALGORITHM",
  INFRA: "INFRA",
  DATABASE: "DATABASE",
};

@Entity()
export class Post extends Base {
  @BeforeInsert()
  initValue() {
    this.count = 0;
    this.views = [];
    this.comments = [];
  }
  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  category: typeof BOARD_CATEGORY[keyof typeof BOARD_CATEGORY];

  @Column()
  count: number;

  @Column()
  userId: string;

  @Column()
  views: string[];

  @Column()
  comments: Comment[];
}
