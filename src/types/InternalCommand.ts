import {
	PermissionFlags,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export type PermissionKeys = keyof PermissionFlags;

export type Categories = "Utils" | "Trivia";

export type Cooldown =
	| `${number}s`
	| `${number}m`
	| `${number}h`
	| `${number}d`;

export type Conditions = "onlyDev" | "premium" | "inDevelopment";

export type Data =
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
