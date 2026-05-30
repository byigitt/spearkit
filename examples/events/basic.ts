/**
 * Events — typed listeners.
 *
 * Handler arguments are inferred from discord.js ClientEvents. Register an
 * event like anything else, or load it from a file (see ../file-based-loading).
 */
import { event } from "spear";

// Positional form: event(name, handler)
export const onReady = event("clientReady", (client) => {
  console.log(`Logged in as ${client.user.tag}`); // client: Client<true>
});

export const onMessage = event("messageCreate", (message) => {
  if (message.author.bot) return; // message: Message
  if (message.content === "!ping") void message.reply("pong");
});

export const onJoin = event("guildMemberAdd", (member) => {
  console.log(`${member.user.tag} joined ${member.guild.name}`); // member: GuildMember
});

// Object form: adds `once` (runs at most once, then auto-detaches).
export const onceReady = event({
  name: "clientReady",
  once: true,
  run: (client) => console.log(`First ready as ${client.user.tag}`),
});
