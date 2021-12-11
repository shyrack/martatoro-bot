import * as DiscordVoice from "@discordjs/voice";
import { Queue } from "../queue/queue";
import { playAudio } from "../util/helperFunctions";
import { MusicQueue } from "../util/types";

export namespace AudioPlayerEvents {
  const audioPlayers = new Map<string, DiscordVoice.AudioPlayer>();

  export const registerListener = (guildId: string) => {
    const musicQueue = Queue.getMusicQueue(guildId);
    const { audioPlayer, songs } = musicQueue.queueMap;
    audioPlayers.set(guildId, audioPlayer);

    audioPlayer.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
      const nextSong = songs.shift();
      if (nextSong !== undefined) {
        musicQueue.queueMap.currentSong = nextSong;
        playAudio(nextSong, audioPlayer);
        // TODO: Send Song Info
      } else {
        musicQueue.queueMap.currentSong = null;
        musicQueue.leaveVoiceChannel();
      }
    });
  };

  export const unregisterListener = (guildId: string) => {
    audioPlayers.delete(guildId);
  };
}
