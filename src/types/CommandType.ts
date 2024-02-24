import { ChatInputCommandInteraction } from "discord.js";
import { Bot } from "../structures/Client";
import {
	Categories,
	Conditions,
	Cooldown,
	Data,
	PermissionKeys,
} from "./InternalCommand";

interface ICommand {
	default: string;
	userPerms: Array<PermissionKeys>;
	clientPerms: Array<PermissionKeys>;
	category: Categories;
	cooldown?: Cooldown;
	conditions?: Array<Conditions>;
	data: Data;

	run({
		client,
		interaction,
	}: {
		client: Bot;
		interaction: ChatInputCommandInteraction<"cached">;
	}): Promise<void>;
}

export default ICommand;
