import * as play from "play-dl";

const getInfoFromSearch = async (term: string) => {
  const youtubeSearchResult = await play.search(term, {
    source: {
      youtube: "video",
    },
  });
  return youtubeSearchResult.shift();
};

export const getInfoFromInput = async (input: string) => {
  const validation = await play.validate(input);
  if (validation === false) return;
  const info = validation === "search" ? await getInfoFromSearch(input) : await play.deezer(input);
  if (info === undefined) return;
  console.log("info", info);
  return info;
};
