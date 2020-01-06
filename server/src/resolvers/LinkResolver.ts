import path from "path";
import {
  Arg,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver,
  ArgsType
} from "type-graphql";
import uuidv5 from "uuid/v5";
import { Link } from "../entity/Link";
import { Tag } from "../entity/Tag";
import downloadImage from "../helpers/downloadImage";
import getMetadata from "../helpers/getMetadata";

@InputType()
class CreateLinkTagsInput {
  @Field()
  name!: string;
}

@InputType()
class CreateLinkInput {
  @Field()
  href!: string;
  @Field(() => [CreateLinkTagsInput], { nullable: true })
  tags?: CreateLinkTagsInput[];
}

@InputType()
class UpdateLinkInput {
  @Field()
  href?: string;
}

@Resolver()
export class LinkResolver {
  @Mutation(() => Link)
  async createLink(
    @Arg("input", () => CreateLinkInput) input: CreateLinkInput
  ) {
    try {
      const { faviconUrl } = getMetadata({ targetUrl: input.href });

      let imageFileName = `${uuidv5(faviconUrl, uuidv5.URL)}${path.extname(
        faviconUrl
      )}`;

      try {
        await downloadImage({
          targetUrl: faviconUrl,
          imageDestination: "./assets/favicons",
          imageFileName
        });
      } catch (e) {
        imageFileName = "";
      }

      const link = await Link.create({
        ...input,
        faviconFileName: imageFileName
      }).save();

      return link;
    } catch (err) {}
  }

  @Mutation(() => Boolean)
  async updateLink(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateLinkInput) input: UpdateLinkInput
  ) {
    await Link.update({ id }, input);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteLink(@Arg("id", () => ID) id: string) {
    await Link.delete({ id });
    return true;
  }

  @Query(() => [Link])
  links() {
    return Link.find({
      order: {
        createdAt: "DESC"
      }
    });
  }
}
