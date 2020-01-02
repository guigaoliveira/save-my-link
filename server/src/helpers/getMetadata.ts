// @ts-ignore
import axios from "axios";
import * as htmlparser2 from "htmlparser2";
import { URL } from "url";

interface GetMetadataParams {
  readonly targetUrl: string;
}

const isUrlAbsolute = (url: string) =>
  url.indexOf("://") > 0 || url.indexOf("//") === 0;

function getFaviconUrl(targetUrl: string, html: string) {
  const relsForFavicon = [
    "shortcut icon",
    "icon",
    "apple-touch-icon",
    "apple-touch-icon-precomposed"
  ];

  let faviconUrl = "";

  const parser = new htmlparser2.Parser(
    {
      onopentag(tagname, attribs) {
        if (!faviconUrl) {
          faviconUrl =
            tagname === "link" && relsForFavicon.includes(attribs?.rel)
              ? attribs.href.split("?")[0]
              : "";
        }
      }
    },
    { decodeEntities: true }
  );

  parser.write(html);

  parser.end();

  if (!faviconUrl || isUrlAbsolute(faviconUrl)) return faviconUrl;

  return `${new URL(targetUrl).origin}${faviconUrl}`;
}

async function getMetadata({ targetUrl }: GetMetadataParams) {
  const { data } = await axios.get(targetUrl);
  return {
    faviconUrl: getFaviconUrl(targetUrl, data)
  };
}

export default getMetadata;
