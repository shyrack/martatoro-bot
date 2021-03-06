import _ from "lodash";
import Discord from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { ClientIdError } from "../errors/ClientIdError";
import { executePlayCommand } from "./play";
import { executeStopCommand } from "./stop";
import { executeSkipCommand } from "./skip";
import { executePauseCommand } from "./pause";
import { executeUnpauseCommand } from "./unpause";

export namespace Commands {
  const commands = _.map(
    [
      new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a YouTube video or livestream.")
        .addStringOption((option) =>
          option
            .setName("input")
            .setDescription("Enter a YouTube link or a search term")
            .setRequired(true),
        ),
      new SlashCommandBuilder().setName("stop").setDescription("Stops the player."),
      new SlashCommandBuilder().setName("skip").setDescription("Skips the currently playing song."),
      new SlashCommandBuilder().setName("pause").setDescription("Pauses the player."),
      new SlashCommandBuilder().setName("unpause").setDescription("Unpauses the player."),
    ],
    (command) => command.toJSON(),
  );

  const registerCommands = (rest: REST, clientId: string, guildId: string) => {
    rest
      .put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      })
      .then(() => console.log("Successfully registered application commands."))
      .catch(console.error);
  };

  const handleCommand = (interaction: Discord.CommandInteraction<Discord.CacheType>) => {
    const { commandName } = interaction;
    const commandExecutors: {
      [key: string]: (interaction: Discord.CommandInteraction<Discord.CacheType>) => Promise<void>;
    } = {
      play: executePlayCommand,
      stop: executeStopCommand,
      skip: executeSkipCommand,
      pause: executePauseCommand,
      unpause: executeUnpauseCommand,
    };
    const commandExecutor = commandExecutors[commandName];
    if (commandExecutor !== undefined) {
      commandExecutor(interaction);
    }
  };

  export const initialize = (client: Discord.Client, rest: REST) => {
    client.on("guildCreate", (guild) => {
      const clientId = client.user?.id;
      const guildId = guild.id;
      if (clientId !== undefined) {
        registerCommands(rest, clientId, guildId);
      } else {
        throw new ClientIdError();
      }
    });

    client.on("ready", () => {
      const clientId = client.user?.id;
      if (clientId !== undefined) {
        client.guilds.cache.forEach((guild) => registerCommands(rest, clientId, guild.id));
      } else {
        throw new ClientIdError();
      }
    });

    client.on("interactionCreate", async (interaction) => {
      if (interaction.isCommand()) {
        handleCommand(interaction);
      }
    });
  };
}
