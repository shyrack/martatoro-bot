import Discord from "discord.js";
import { REST } from "@discordjs/rest";
import { Commands } from "./commands/commands";
import { BotTokenError } from "./errors/BotTokenError";

const token = process.env.MARTATORO_BOT_TOKEN;

if (token === undefined) {
  throw new BotTokenError();
}

export const rest = new REST({}).setToken(token);
export const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS],
});

client.login(token);

Commands.initialize(client, rest);

client.on("ready", () => console.log("Happy Hacking!"));
