import {Base} from "./base.entity";
import {Column, Entity} from "typeorm";

@Entity()
export class User extends Base {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  token : string;
}
