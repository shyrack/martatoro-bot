import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import * as play from "play-dl";

export type Song = {
  infoData: Awaited<ReturnType<typeof play.video_info>>;
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
