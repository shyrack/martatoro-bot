import Discord from "discord.js";
import { Queue } from "../queue/queue";

export const executeUnpauseCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId } = interaction;
  const musicQueue = Queue.getMusicQueue(guildId).queueMap;
  if (musicQueue.isPaused === true) {
    musicQueue.audioPlayer.unpause();
    musicQueue.isPaused = false;
    interaction.reply("The player has been unpaused.");
  } else {
    interaction.reply("The player cannot be unpaused.");
  }
};
