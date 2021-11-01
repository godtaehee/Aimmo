import {CreateDateColumn, ObjectID, ObjectIdColumn, UpdateDateColumn} from "typeorm";

export abstract class Base {
  @ObjectIdColumn()
  id: ObjectID;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
