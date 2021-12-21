import _ from "lodash";
import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import ytdl from "ytdl-core-discord";
import yts from "yt-search";
import ytpl from "ytpl";
import { Playable, PlayableList, PlayableSong } from "./types";

export const playAudio = async (playable: PlayableSong, audioPlayer: DiscordVoice.AudioPlayer) => {
  let stream = await ytdl(playable.url, {
    filter: "audioonly",
    quality: "highestaudio",
    liveBuffer: playable.isLive === true ? 1 << 11 : 0,
    dlChunkSize: playable.isLive === true ? 1 << 10 : 1 << 27,
    highWaterMark: playable.isLive === true ? 1 << 25 : 1 << 22,
  });
  const audioResource = DiscordVoice.createAudioResource(stream, {
    inputType: DiscordVoice.StreamType.Opus,
  });
  audioPlayer.play(audioResource);
};

const validateInput = (input: string) => {
  const isPlaylist = ytpl.validateID(input);
  const isVideo = ytdl.validateURL(input);
  if (isPlaylist) return "playlist";
  if (isVideo) return "video";
  return "search";
};

const playableFromUrl = async (url: string, member: Discord.GuildMember): Promise<PlayableSong> => {
  const video = await ytdl.getBasicInfo(url);
  const details = video.videoDetails;
  return {
    channel: details.ownerChannelName,
    isLive: details.isLiveContent,
    member: member,
    thumbnailUrl: _.find(details.thumbnails, (thumbnail) => thumbnail.url !== null)?.url ?? "",
    title: details.title,
    uploadedAt: details.uploadDate,
    url: details.video_url,
  };
};

const playableFromYouTubePlaylist = async (
  url: string,
  member: Discord.GuildMember,
): Promise<PlayableList> => {
  const playlist = await ytpl(url, {
    limit: Infinity,
  });
  return {
    channel: playlist.author.name,
    member: member,
    thumbnailUrl: _.find(playlist.thumbnails, (thumbnail) => thumbnail.url !== null)?.url ?? "",
    title: playlist.title,
    uploadedAt: playlist.lastUpdated,
    url: playlist.url,
    urls: _.map(playlist.items, (item) => item.url),
  };
};

const playableFromSearch = async (
  term: string,
  member: Discord.GuildMember,
): Promise<Playable | undefined> => {
  const results = await yts(term);
  const videoUrl = results.videos.shift()?.url;
  if (videoUrl !== undefined) {
    return playableFromUrl(videoUrl, member);
  }
};

export const playableFromInput = async (
  input: string,
  member: Discord.GuildMember,
): Promise<Playable | undefined> => {
  const validation = validateInput(input);
  return validation === "search"
    ? playableFromSearch(input, member)
    : validation === "video"
    ? playableFromUrl(input, member)
    : playableFromYouTubePlaylist(input, member);
};

export const embedFromPlayable = (
  playable: Playable,
  description: string,
  member: Discord.GuildMember,
  queueLength: number,
) => {
  const { channel, thumbnailUrl, title, uploadedAt, url } = playable;
  const embed = new Discord.MessageEmbed().setColor("#0088aa");
  const fields: Discord.EmbedFieldData[] = [
    {
      name: "Hochgeladen von:",
      value: channel !== undefined ? channel ?? "" : "",
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
  embed.setThumbnail(thumbnailUrl);
  embed.setDescription(description);
  embed.addFields(fields);
  return embed;
};
