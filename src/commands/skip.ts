import Discord from "discord.js";
import { Queue } from "../queue/queue";

export const executeSkipCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member } = interaction;
  if (member instanceof Discord.GuildMember) {
    const musicQueue = Queue.getMusicQueue(guildId);
    musicQueue.skip();
    interaction.reply("The current song has been skipped.");
    return;
  }
  interaction.reply("Sorry, we couldn't skip the current song.");
};
