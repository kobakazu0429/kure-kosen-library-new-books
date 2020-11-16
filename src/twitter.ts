import * as Twitter from "twitter";
import { Book } from "./opac";

const client = new Twitter({
  consumer_key: process.env.CK || "",
  consumer_secret: process.env.CS || "",
  access_token_key: process.env.AK || "",
  access_token_secret: process.env.AS || "",
});

function postTwitter(body: string) {
  return new Promise((resolve: (t: Twitter.ResponseData) => void, reject) => {
    client.post(
      "statuses/update",
      { status: body },
      (error, tweet, _response) => {
        if (error) reject(error);
        resolve(tweet);
      }
    );
  });
}

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
