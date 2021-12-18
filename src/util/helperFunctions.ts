import _ from "lodash";
import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import * as play from "play-dl";
import { Song } from "./types";

export const playAudio = async (song: Song, audioPlayer: DiscordVoice.AudioPlayer) => {
  let streamData = await play.stream_from_info(song.infoData, {
    quality: 2,
  });
  const audioResource = DiscordVoice.createAudioResource(streamData.stream, {
    inputType: streamData.type,
  });
  audioPlayer.play(audioResource);
};

const validateYouTubePlaylist = async (input: Awaited<ReturnType<typeof play.validate>>) => {
  const validation = await input;
  return validation === "yt_playlist";
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

const getInfosFromYouTubePlaylist = async (input: string) => {
  const playlistInfo = await play.playlist_info(input);
  let playlistInfos: play.YouTubeVideo[] = [];
  for (let i = 0; i < playlistInfo.total_pages; i++) {
    playlistInfos.push(...playlistInfo.page(i));
  }
  const videoInfos = await Promise.all(_.map(playlistInfos, (info) => play.video_info(info.url)));
  return videoInfos;
};

export const getInfosFromInput = async (input: string) => {
  const validation = await play.validate(input);
  const isPlaylist = await validateYouTubePlaylist(validation);
  if (isPlaylist === true) {
    const playlistInfos = await getInfosFromYouTubePlaylist(input);
    return playlistInfos;
  } else if (
    validation !== false &&
    (validation.includes("yt") === true || validation === "search")
  ) {
    const info =
      validation === "search" ? await getInfoFromSearch(input) : await play.video_info(input);
    if (info === undefined) return;
    return [info];
  }
};

export const getEmbedFromInfo = (
  videoDetails: play.YouTubeVideo,
  description: string,
  member: Discord.GuildMember,
  queueLength: number,
) => {
  const { channel, durationInSec, thumbnails, title, uploadedAt, url } = videoDetails;
  const embed = new Discord.MessageEmbed().setColor("#0088aa");
  const fields: Discord.EmbedFieldData[] = [
    {
      name: "Videolänge:",
      value: formatDuration(durationInSec),
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
      value: member.nickname ?? member.displayName,
      inline: true,
    },
  ];
  if (queueLength !== 0)
    fields.push({
      name: "Warteschlange:",
      value: queueLength.toString(),
      inline: true,
    });
  embed.setTitle(title ?? "");
  embed.setURL(url);
  embed.setThumbnail(thumbnails[0].url);
  embed.setDescription(description);
  embed.addFields(fields);
  return embed;
};

const formatDuration = (seconds: number) => {
  if (seconds === 0) {
    return "livestream";
  } else if (seconds < 3600) {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  } else {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  }
};
