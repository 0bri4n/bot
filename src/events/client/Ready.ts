import { ActivityType } from "discord.js";
import { Bot } from "../../structures/Client";
import Event from "../../structures/Event";

export default class Ready extends Event {
	constructor(client: Bot) {
		super(client, "ready");
	}

	async run(): Promise<void> {
		this.client.user?.setPresence({
			activities: [
				{
					name: "Wanna bot",
					type: ActivityType.Watching,
				},
			],
		});

		console.log(
			`Conectado con exito a: ${this.client.user?.username} (ID: ${this.client.user?.id}) | (Users: ${this.client.users.cache.size})`,
		);
	}
}
