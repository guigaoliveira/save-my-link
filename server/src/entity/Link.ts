import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany
} from "typeorm";
import { Field, ID, ObjectType, InputType } from "type-graphql";
import { Tag } from "./Tag";
@ObjectType()
@InputType("LinkInput")
@Entity()
export class Link extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  href!: string;

  @Field()
  @Column({ default: "" })
  faviconFileName!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @Field(() => [Tag], { nullable: true })
  @OneToMany(
    () => Tag,
    tags => tags.link,
    {
      cascade: ["insert", "update"]
    }
  )
  tags?: Tag[];

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateDateUpdate() {
    this.updatedAt = new Date();
  }
}
