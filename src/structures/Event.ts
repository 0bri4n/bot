import { ClientEvents } from "discord.js";
import { Bot } from "./Client";

export abstract class EventStructure {
	protected constructor(
		public client: Bot,
		public name: keyof ClientEvents,
		public once = false,
	) {}
	abstract run(...args): Promise<void>;
}

export default EventStructure;
