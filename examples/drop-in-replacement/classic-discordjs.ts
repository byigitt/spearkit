/**
 * Drop-in replacement.
 *
 * spear re-exports all of discord.js. To migrate an existing bot, change
 * `from "discord.js"` to `from "spear"` and nothing else. This file is 100%
 * classic discord.js — only the import source changed.
 */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "spear";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with an embed and a button");

client.once(Events.ClientReady, (c) => {
  console.log(`Ready as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "ping") return;

  const embed = new EmbedBuilder().setTitle("Pong!").setDescription(`Latency: ${client.ws.ping}ms`);
  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("again").setLabel("Again").setStyle(ButtonStyle.Primary),
  );
  await interaction.reply({ embeds: [embed], components: [buttons] });
});

async function deploy(token: string, appId: string): Promise<void> {
  const rest = new REST().setToken(token);
  await rest.put(Routes.applicationCommands(appId), { body: [pingCommand.toJSON()] });
}

async function main(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const appId = process.env.DISCORD_APP_ID;
  if (token === undefined || appId === undefined) {
    throw new Error("Set DISCORD_TOKEN and DISCORD_APP_ID");
  }
  await deploy(token, appId);
  await client.login(token);
}

void main();
