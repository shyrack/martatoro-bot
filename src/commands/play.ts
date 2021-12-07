import Discord from "discord.js";

export const executePlayCommand = async (
  interaction: Discord.CommandInteraction<Discord.CacheType>,
) => {
  const { guildId, member, options } = interaction;
  const link = options.getString("link");
  if (link !== null) {
  } else {
    interaction.reply("");
  }
};
