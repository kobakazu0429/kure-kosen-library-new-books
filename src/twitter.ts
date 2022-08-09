import {
  TwitterApi,
  EUploadMimeType,
  type SendTweetV1Params,
} from "twitter-api-v2";
import { Book } from "./opac";

const twitterClient = new TwitterApi({
  appKey: process.env.API_KEY ?? "",
  appSecret: process.env.API_KEY_SECRET ?? "",
  accessToken: process.env.ACCESS_TOKEN ?? "",
  accessSecret: process.env.ACCESS_SECRET ?? "",
});

const postTwitter = async (
  body: string,
  mediaIds?: SendTweetV1Params["media_ids"]
) => {
  const payload: Partial<SendTweetV1Params> = {};
  if (mediaIds) payload["media_ids"] = mediaIds;

  return twitterClient.v1.tweet(body, payload);
};

export async function feed({ date, title, url }: Book) {
  try {
    const body = [
      `${date}: ${title}`,
      url,
      "",
      "使い方▶︎https://twitter.com/kure_lib_feed/status/1328374633934974982",
    ].join("\n");
    const res = await postTwitter(body);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export const postWithMedia = async (body: string, media: Buffer) => {
  const id = await twitterClient.v1.uploadMedia(media, {
    mimeType: EUploadMimeType.Png,
  });
  return postTwitter(body, id);
};
