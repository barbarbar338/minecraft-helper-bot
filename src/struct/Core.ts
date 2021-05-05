import { Bot, createBot } from "mineflayer";
import { readdirSync } from "fs";
import { resolve } from "path";
import { CONFIG } from "../config";
import * as pogger from "pogger";
import { BotStateMachine } from "mineflayer-statemachine";
import { Utils } from "./Utils";
import { plugins } from "./Plugins";
import { IndexedData } from "minecraft-data";
import { I18n } from "locale-parser";

export class Core extends Utils {
	public bot: Bot;

	public statemachine?: BotStateMachine;
	public minecraft_data?: IndexedData;

	public language = CONFIG.LOCALE_PARSER_OPTIONS.defaultLocale;
	public logger = pogger;
	public commands = new Map<string, Bot.Command>();
	public i18n = new I18n(CONFIG.LOCALE_PARSER_OPTIONS);

	constructor() {
		super();

		this.bot = createBot(CONFIG.BOT_OPTIONS);
		this.bot.loadPlugins(plugins);
	}

	private async eventLoader() {
		this.logger.event("Loading events");

		const files = readdirSync(resolve(__dirname, "..", "events"));
		this.logger.info(`Loading ${files.length} event...`);

		for (const file of files) {
			const event = (
				await import(resolve(__dirname, "..", "events", file))
			).default as Bot.Event;

			this.bot[event.once ? "once" : "on"](event.name, (...args: any[]) =>
				event.execute(this, ...args),
			);

			this.logger.success(`Event ${event.name} loaded!`);
		}
	}

	private async commanLoader() {
		this.logger.event("Loading commands");

		const files = readdirSync(resolve(__dirname, "..", "commands"));
		this.logger.info(`Loading ${files.length} commands...`);

		for (const file of files) {
			const command = (
				await import(resolve(__dirname, "..", "commands", file))
			).default as Bot.Command;

			this.commands.set(command.name, command);

			for (const alias of command.aliases) {
				this.commands.set(alias, command);
			}

			this.logger.success(`Command ${command.name} loaded!`);
		}
	}

	public async init() {
		await this.commanLoader();
		await this.eventLoader();

		this.logger.success("All files loaded!");
	}
}
