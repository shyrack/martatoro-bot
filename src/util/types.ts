import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";

export type Playable = {
  channel: string;
  duration: number;
  isLive: boolean;
  member: Discord.GuildMember;
  thumbnailUrl: string;
  title: string;
  uploadedAt: string;
  urls: string[];
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
