import ytdl from "ytdl-core";
import yts from "yt-search";

export const getLinkFromInput = async (input: string) => {
  if (ytdl.validateURL(input)) return input;
  const results = await yts(input);
  const result = results.videos.shift();
  if (result !== undefined) return result.url;
};
