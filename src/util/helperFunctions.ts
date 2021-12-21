import _ from "lodash";
import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import ytdl from "ytdl-core-discord";
import yts from "yt-search";
import ytpl from "ytpl";
import { Playable } from "../playable/Playable";
import { PlayableSong } from "../playable/PlayableSong";
import { PlayableList } from "../playable/PlayableList";

export const playAudio = async (
  audioPlayer: DiscordVoice.AudioPlayer,
  isLive: boolean,
  url: string,
) => {
  let stream = await ytdl(url, {
    filter: "audioonly",
    quality: "highestaudio",
    liveBuffer: isLive === true ? 1 << 11 : 0,
    dlChunkSize: isLive === true ? 1 << 10 : 1 << 27,
    highWaterMark: isLive === true ? 1 << 25 : 1 << 22,
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

export const playableFromUrl = async (
  url: string,
  member: Discord.GuildMember,
): Promise<PlayableSong> => {
  const video = await ytdl.getBasicInfo(url);
  const { ownerChannelName, isLiveContent, thumbnails, title, uploadDate, video_url } =
    video.videoDetails;
  const thumbnailUrl = _.find(thumbnails, (thumbnail) => thumbnail.url !== null)?.url ?? "";
  return new PlayableSong(
    ownerChannelName,
    isLiveContent,
    member,
    thumbnailUrl,
    title,
    uploadDate,
    video_url,
  );
};

const playableFromYouTubePlaylist = async (
  url: string,
  member: Discord.GuildMember,
): Promise<PlayableList> => {
  const playlist = await ytpl(url, {
    limit: Infinity,
  });
  const { author, thumbnails, title, lastUpdated, items } = playlist;
  const thumbnailUrl = _.find(thumbnails, (thumbnail) => thumbnail.url !== null)?.url ?? "";
  const urls = _.map(items, (item) => item.url);
  return new PlayableList(
    author.name,
    member,
    thumbnailUrl,
    title,
    lastUpdated,
    playlist.url,
    urls,
  );
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
  const embed = new Discord.MessageEmbed().setColor("#0088aa");
  const fields: Discord.EmbedFieldData[] = [
    {
      name: "Hochgeladen von:",
      value: playable.getChannel !== undefined ? playable.getChannel ?? "" : "",
      inline: true,
    },
    { name: "Hochgeladen am:", value: playable.getUploadDate ?? "", inline: true },
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
  embed.setTitle(playable.getTitle ?? "");
  embed.setURL(playable.getUrl);
  embed.setThumbnail(playable.getThumbnailUrl);
  embed.setDescription(description);
  embed.addFields(fields);
  return embed;
};
