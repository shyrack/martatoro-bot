import * as DiscordVoice from "@discordjs/voice";
import { Queue } from "../queue/queue";
import { playAudio } from "../util/helperFunctions";

export namespace AudioPlayerEvents {
  const audioPlayers = new Map<string, DiscordVoice.AudioPlayer>();

  export const registerListener = (guildId: string) => {
    const musicQueue = Queue.getMusicQueue(guildId);
    const { audioPlayer, playables } = musicQueue.queueMap;
    audioPlayers.set(guildId, audioPlayer);

    audioPlayer.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
      const nextPlayable = playables.shift();
      if (nextPlayable !== undefined) {
        musicQueue.queueMap.currentSong = nextPlayable;
        playAudio(audioPlayer, nextPlayable.isLive, nextPlayable.getUrl);
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
