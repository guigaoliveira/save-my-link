import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity
} from "typeorm";
import { Field, ID, ObjectType, InputType } from "type-graphql";
import { Link } from "./Link";

@ObjectType()
@InputType("TagInput")
@Entity()
export class Tag extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  name!: string;

  @ManyToOne(
    () => Link,
    link => link.tags
  )
  link!: Link;
}
