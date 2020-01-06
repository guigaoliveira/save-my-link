import { URL } from "url";
interface GetMetadataParams {
  readonly targetUrl: string;
}

function getFaviconUrl(targetUrl: string) {
  return `${new URL(targetUrl).origin}/favicon.ico`;
}

function getMetadata({ targetUrl }: GetMetadataParams) {
  return {
    faviconUrl: getFaviconUrl(targetUrl)
  };
}

export default getMetadata;
