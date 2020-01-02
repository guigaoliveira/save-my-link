import path from "path";
import {
  Arg,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import uuidv5 from "uuid/v5";
import { Link } from "../entity/Link";
import downloadImage from "../helpers/downloadImage";
import getMetadata from "../helpers/getMetadata";

@InputType()
class LinkInput {
  @Field()
  href!: string;
}

@InputType()
class LinkUpdateInput {
  @Field()
  href?: string;
}

@Resolver()
export class LinkResolver {
  @Mutation(() => Link)
  async createLink(@Arg("input", () => LinkInput) input: LinkInput) {
    try {
      const { faviconUrl } = await getMetadata({ targetUrl: input.href });
      let imageFileName = "";

      if (faviconUrl) {
        try {
          imageFileName = `${uuidv5(faviconUrl, uuidv5.URL)}${path.extname(
            faviconUrl
          )}`;

          await downloadImage({
            targetUrl: faviconUrl,
            imageDestination: "./assets/favicons",
            imageFileName
          });
        } catch (e) {
          imageFileName = "";
        }
      }

      const link = await Link.create({
        ...input,
        faviconFileName: imageFileName
      }).save();

      return link;
    } catch (err) {
      console.log(err);
    }
  }

  @Mutation(() => Boolean)
  async updateLink(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => LinkUpdateInput) input: LinkUpdateInput
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
