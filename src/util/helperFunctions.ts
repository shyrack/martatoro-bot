import * as play from "play-dl";

function typeOfReturn<A, B>(fn: (a: A) => B) {
  return {} as B;
}

const validationReturn = typeOfReturn(play.validate);
type validationReturnType = typeof validationReturn;

const isPlayList = async (validationPromise: validationReturnType) => {
  const validation = await validationPromise;
  if (validation === false) return false;
  return validation.includes("playlist");
};

const isAlbum = async (validationPromise: validationReturnType) => {
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
