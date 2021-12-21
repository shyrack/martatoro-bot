import Discord from "discord.js";
import * as DiscordVoice from "@discordjs/voice";
import { Playable } from "../playable/Playable";

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
