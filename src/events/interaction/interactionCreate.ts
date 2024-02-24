import { ChatInputCommandInteraction, Interaction } from "discord.js";
import { Bot } from "../../structures/Client";
import CommandStructure from "../../structures/Command";
import { CustomError } from "../../structures/CustomError";
import EventStructure from "../../structures/Event";

export default class IntCreate extends EventStructure {
	constructor(client: Bot) {
		super(client, "interactionCreate");
	}

	public async run(
		interaction: Interaction<"cached"> | ChatInputCommandInteraction<"cached">,
	): Promise<void> {
		if (interaction.isCommand()) {
			const { commandName: name } = interaction;
			const cmd = this.client.commands.get(name) as CommandStructure;

			try {
				for await (const condition of cmd._options.conditions || []) {
					const imported = await import(`../conditions/${condition}`);
					const conditionFunction = imported.default;
					await conditionFunction(interaction.user.id);
				}
			} catch (err) {
				if (err instanceof CustomError) {
					interaction.reply({
						content: `Error: ${err.message}`,
						ephemeral: true,
					});
				}
			}

			try {
				if (
					interaction instanceof ChatInputCommandInteraction &&
					interaction.inCachedGuild()
				) {
					await this.client.checkPermissionsForUser({ interaction, cmd });
					await this.client.checkPermissionsForMe({ interaction, cmd });
				}
			} catch (err) {
				if (err instanceof CustomError) {
					interaction.reply({
						content: `Error: ${err.message}`,
						ephemeral: true,
					});
				}
			}
			if (interaction.isChatInputCommand() && interaction.inCachedGuild()) {
				cmd
					?.run({
						client: this.client,
						interaction,
					})
					.catch((err: CustomError) => {
						if (err instanceof CustomError) {
							return interaction.reply({
								content: `Error: ${err.message}`,
								ephemeral: true,
							});
						}
						console.error(err);
					});
			}
		}
	}
}
