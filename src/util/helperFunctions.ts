import Discord from "discord.js";
import * as play from "play-dl";
import { InfoData } from "play-dl/dist/YouTube/utils/constants";

const formatDuration = (seconds: number) => {
  if (seconds === 0) {
    return "livestream";
  } else if (seconds < 3600) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  } else {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
};

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

export const getEmbedFromInfo = (
  videoDetails: play.YouTubeVideo,
  description: string,
  member: Discord.GuildMember,
) => {
  const { channel, durationInSec, thumbnails, title, uploadedAt, url } = videoDetails;
  const embed = new Discord.MessageEmbed().setColor("#0088aa");
  embed.setTitle(title ?? "");
  embed.setURL(url);
  embed.setThumbnail(thumbnails[0].url);
  embed.setDescription(description);
  embed.addFields(
    {
      name: "Videolänge:",
      value: formatDuration(durationInSec).toString(),
      inline: true,
    },
    {
      name: "Hochgeladen von:",
      value: channel !== undefined ? channel.name ?? "" : "",
      inline: true,
    },
    { name: "Hochgeladen am:", value: uploadedAt ?? "", inline: true },
    {
      name: "Hinzugefügt von:",
      value: member.nickname !== null ? member.nickname : member.displayName,
      inline: true,
    },
  );
  return embed;
};
