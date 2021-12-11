import Discord from "discord.js";
import { Queue } from "../queue/queue";

export const executeStopCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member } = interaction;
  if (member instanceof Discord.GuildMember) {
    const musicQueue = Queue.getMusicQueue(guildId);
    musicQueue.stop();
    interaction.reply("The current queue has been stopped, see you later.");
    return;
  }
  interaction.reply("Sorry, we couldn't stop the current song.");
};
