import Discord from "discord.js";
import { Queue } from "../queue/queue";

export const executeSkipCommand = async (interaction: Discord.CommandInteraction<Discord.CacheType>) => {
  const { guildId } = interaction;
  if (guildId === null) {
    return;
  }
  const musicQueue = Queue.getMusicQueue(guildId);
  musicQueue.skip();
  interaction.reply("The current song has been skipped.");
};
