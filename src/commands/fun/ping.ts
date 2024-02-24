import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "../../structures/Command";

export default class PingCommand extends Command {
	static emojis = (ping: number): "🟢" | "🟡" | "🔴" | undefined => {
		if (ping <= 100) return "🟢";
		if (ping <= 200) return "🟡";
		if (ping >= 200) return "🔴";
	};

	constructor() {
		super({
			category: "Utils",
			userPerms: ["SendMessages", "UseApplicationCommands"],
			clientPerms: ["SendMessages"],
			data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),

			run: async ({ client, interaction }): Promise<void> => {
				const embed = new EmbedBuilder()
					.setTitle(`\`${PingCommand.emojis(client.ws.ping)}\`  |  Ping...`)
					.setColor(Colors.Grey);
				const reply = await interaction.reply({
					embeds: [embed],
					fetchReply: true,
				});

				await reply.edit({
					embeds: [
						embed.setTitle(
							`\`${PingCommand.emojis(client.ws.ping)}\`  |  Pong...`,
						),
						embed.setColor(Colors.Green),
						embed.setDescription(
							`> **Latencia:** \`${
								reply.createdTimestamp - Date.now()
							}ms\`\n> **API:** \`${client.ws.ping}ms\``,
						),
						embed.setTimestamp(),
						embed.setFooter({
							text: `${client.user?.username}`,
							iconURL: interaction.user?.displayAvatarURL(),
						}),
					],
				});
			},
		});
	}
}
