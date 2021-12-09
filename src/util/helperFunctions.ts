import * as play from "play-dl";

const getInfoFromSearch = async (term: string) => {
  const youtubeSearchResults = await play.search(term, {
    source: {
      youtube: "video",
    },
  });
  const result = youtubeSearchResults.shift();
  const url = result?.url;
  if (url !== undefined) {
    return play.video_info(url);
  }
};

export const getInfoFromInput = async (input: string) => {
  const validation = await play.validate(input);
  if (validation === false || (validation.includes("yt") === false && validation !== "search"))
    return;
  const info =
    validation === "search" ? await getInfoFromSearch(input) : await play.video_info(input);
  if (info === undefined) return;
  return info;
};
