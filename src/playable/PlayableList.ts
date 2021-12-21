import Discord from "discord.js";
import { Playable } from "./Playable";

export class PlayableList extends Playable {
  private urls: string[];

  constructor(
    channel: string,
    member: Discord.GuildMember,
    thumbnailUrl: string,
    title: string,
    uploadDate: string,
    url: string,
    urls: string[],
  ) {
    super(channel, member, thumbnailUrl, title, uploadDate, url);
    this.urls = urls;
  }

  get getUrls() {
    return this.urls;
  }
}
