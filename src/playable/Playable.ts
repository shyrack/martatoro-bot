import Discord from "discord.js";

export class Playable {
  private channel: string;
  private member: Discord.GuildMember;
  private thumbnailUrl: string;
  private title: string;
  private uploadDate: string;
  private url: string;

  constructor(
    channel: string,
    member: Discord.GuildMember,
    thumbnailUrl: string,
    title: string,
    uploadDate: string,
    url: string,
  ) {
    this.channel = channel;
    this.member = member;
    this.thumbnailUrl = thumbnailUrl;
    this.title = title;
    this.uploadDate = uploadDate;
    this.url = url;
  }

  get getChannel() {
    return this.channel;
  }

  get getMember() {
    return this.member;
  }

  get getThumbnailUrl() {
    return this.thumbnailUrl;
  }

  get getTitle() {
    return this.title;
  }

  get getUploadDate() {
    return this.uploadDate;
  }

  get getUrl() {
    return this.url;
  }
}
