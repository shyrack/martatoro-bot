import * as DiscordVoice from "@discordjs/voice";
import { playAudio } from "../util/helperFunctions";
import { MusicQueue } from "../util/types";

export namespace AudioPlayerEvents {
  const audioPlayers = new Map<string, DiscordVoice.AudioPlayer>();

  export const registerListener = (guildId: string, musicQueue: MusicQueue) => {
    const { audioPlayer, songs } = musicQueue;
    audioPlayers.set(guildId, audioPlayer);

    audioPlayer.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
      const nextSong = songs.shift();
      if (nextSong !== undefined) {
        musicQueue.currentSong = nextSong;
        playAudio(nextSong, audioPlayer);
        // TODO: Send Song Info
      } else {
        musicQueue.currentSong = null;
        // TODO: Leave VoiceChannel
      }
    });
  };

  export const unregisterListener = (guildId: string) => {
    audioPlayers.delete(guildId);
  };
}
