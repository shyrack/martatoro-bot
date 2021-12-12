import Discord from "discord.js";
import { Queue } from "../queue/queue";

export const executePauseCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId } = interaction;
  const musicQueue = Queue.getMusicQueue(guildId).queueMap;
  musicQueue.audioPlayer.pause();
  musicQueue.isPaused = true;
  interaction.reply("The player has been paused.");
};
