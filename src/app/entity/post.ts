import {Base} from "./base.entity";
import {Column, Entity} from "typeorm";

@Entity()
export class Post extends Base {
  @Column()
  title: string;

  @Column()
  text: string;
}
