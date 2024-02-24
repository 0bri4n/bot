import {
	ApplicationCommandDataResolvable,
	Client,
	Collection,
	GatewayIntentBits,
	Interaction,
	User,
} from "discord.js";
import { readdirSync } from "fs";
import CommandStructure from "./Command";
import { CustomError } from "./CustomError";

export type CommandMap<T extends Interaction = Interaction> = Collection<
	string,
	CommandStructure
>;

export class Bot extends Client {
	owner: User;
	commands: CommandMap<Interaction>;

	constructor() {
		super({ intents: [GatewayIntentBits.Guilds] });

		this.commands = new Collection();
		this.owner = this.application?.owner as User;
	}

	public async start(): Promise<void> {
		await this.runCommands();
		await this.runEvents();

		await super.login(process.env.BOT_TOKEN);
	}

	private async runCommands(): Promise<void> {
		const cmd: Array<ApplicationCommandDataResolvable> = [];
		// biome-ignore lint/complexity/noForEach: <explanation>
		readdirSync("./src/commands").forEach(async (dir): Promise<void> => {
			const commands = readdirSync(`./src/commands/${dir}`).filter(
				(file): boolean => file.endsWith(".ts"),
			);
			for (const file of commands) {
				const command = await import(`../commands/${dir}/${file}`);
				const commandInstance = new command.default(this);

				if (commandInstance._options.data.name !== undefined) {
					this.commands.set(commandInstance._options.data.name, command);
					cmd.push(JSON.parse(JSON.stringify(commandInstance._options.data)));
					console.log(
						`Comando ${commandInstance._options.data.name} cargado con exito`,
					);
				} else {
					console.log(
						`El comando ${commandInstance._options.data.name} no se pudo cargar`,
					);
				}
			}
		});

		this.on("ready", (): void => {
			this.application?.commands.set(cmd);
			console.log("Comandos cargados con exito");
		});
	}

	private async runEvents(): Promise<void> {
		// biome-ignore lint/complexity/noForEach: <explanation>
		readdirSync("./src/events").forEach(async (dir): Promise<void> => {
			const events = readdirSync(`./src/events/${dir}`).filter(
				(file): boolean => file.endsWith(".ts"),
			);
			for (const file of events) {
				const event = await import(`../events/${dir}/${file}`);
				const eventInstance = new event.default(this);
				if (event.once) {
					this.once(eventInstance.name, (...args) =>
						eventInstance.run(...args),
					);
				} else {
					this.on(eventInstance.name, (...args) => eventInstance.run(...args));
				}
			}
		});
	}

	public handleError({
		error,
		description,
	}: {
		error: string;
		description: string;
	}): Promise<never> {
		return Promise.reject(new CustomError({ error, description }));
	}

	public async checkPermissionsForUser({
		interaction,
		cmd,
	}: {
		interaction: Interaction<"cached">;
		cmd: CommandStructure;
	}): Promise<void> {
		const command: CommandStructure = cmd;
		if (interaction.member?.permissions.has(command._options.userPerms || [])) {
			return Promise.resolve();
		}

		return Promise.reject(
			new CustomError({
				error: "Permisos insuficientes",
				description: `Requieres de los siguientes permisos: \`${
					command._options.userPerms ||
					[]
						.filter((perm) => interaction.member.permissions.missing(perm))
						.join(", ")
				}\``,
			}),
		);
	}

	public async checkPermissionsForMe({
		interaction,
		cmd,
	}: {
		interaction: Interaction<"cached">;
		cmd: CommandStructure;
	}): Promise<void> {
		const command: CommandStructure = cmd;
		if (
			interaction.guild.members.me?.permissions.has(
				command._options.clientPerms || [],
			)
		) {
			return Promise.resolve();
		}

		return Promise.reject(
			new CustomError({
				error: "Missing Permissions",
				description: `Requiero de los siguientes permisos: \`${
					command._options.clientPerms ||
					[]
						.filter((perm) =>
							interaction.guild.members.me?.permissions.missing(perm),
						)
						.join(", ")
				}\``,
			}),
		);
	}
}
