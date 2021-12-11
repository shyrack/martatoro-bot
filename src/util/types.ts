import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import { InfoData } from "play-dl/dist/YouTube/utils/constants";

export type Song = {
  infoData: InfoData;
  isLive: boolean;
  member: Discord.GuildMember;
};

export type MusicQueue = {
  audioPlayer: DiscordVoice.AudioPlayer;
  currentSong: Song | null;
  guildId: string;
  isPaused: boolean;
  playerSubscription: DiscordVoice.PlayerSubscription | undefined;
  songs: Song[];
  voiceChannel: Discord.VoiceChannel | Discord.StageChannel | null;
  voiceConnection: DiscordVoice.VoiceConnection | null;
};
