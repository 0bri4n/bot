import { ChatInputCommandInteraction } from "discord.js";
import CommandType from "../types/CommandType";
import { Bot } from "./Client";

class CommandStructure {
	_options: Partial<CommandType>;

	constructor(options: Partial<CommandType>) {
		this._options = { ...options };
	}

	run: ({
		client,
		interaction,
	}: {
		client: Bot;
		interaction: ChatInputCommandInteraction<"cached">;
	}) => Promise<void>;
}

export default CommandStructure;
