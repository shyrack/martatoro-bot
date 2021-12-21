import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";

export type Playable = {
  channel: string;
  member: Discord.GuildMember;
  thumbnailUrl: string;
  title: string;
  uploadedAt: string;
  url: string;
};

export type PlayableList = Playable & {
  urls: string[];
};

export type PlayableSong = Playable & {
  isLive: boolean;
};

export type MusicQueue = {
  audioPlayer: DiscordVoice.AudioPlayer;
  currentSong: Playable | null;
  guildId: string;
  isPaused: boolean;
  playerSubscription: DiscordVoice.PlayerSubscription | undefined;
  playables: Playable[];
  voiceChannel: Discord.VoiceChannel | Discord.StageChannel | null;
  voiceConnection: DiscordVoice.VoiceConnection | null;
};
