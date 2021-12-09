import * as play from "play-dl";

const isPlayList = async (validationPromise: ReturnType<typeof play.validate>) => {
  const validation = await validationPromise;
  if (validation === false) return false;
  return validation.includes("playlist");
};

const isAlbum = async (validationPromise: ReturnType<typeof play.validate>) => {
  const validation = await validationPromise;
  if (validation === false) return false;
  return validation.includes("album");
};

export const getInfoFromInput = async (input: string) => {
  const validation = await play.validate(input);
  if (validation !== false) {
    const info = await play.video_info(input);
    console.log("info", info);
  }
};
