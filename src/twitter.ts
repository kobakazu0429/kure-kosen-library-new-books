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
  const body = [`${date}: ${title}`, url].join("\n");
  const res = await postTwitter(body);
  return res;
}
