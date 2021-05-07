import { Bot, BotEvents, createBot } from "mineflayer";
import { readdirSync } from "fs";
import { resolve } from "path";
import { CONFIG } from "../config";
import * as pogger from "pogger";
import { BotStateMachine } from "mineflayer-statemachine";
import { Utils } from "./Utils";
import { plugins } from "./Plugins";
import { IndexedData } from "minecraft-data";
import { I18n } from "locale-parser";
import { Vec3 } from "vec3";
import { goals, Movements } from "mineflayer-pathfinder";

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

	public isMoving = () => this.isOnState() || this.isActing();

	public isOnState = () =>
		!!this.getFarming().farmed_at ||
		!!this.getCollecting() ||
		!!this.getFollowing();

	public isActing = () =>
		!!this.getFalling() ||
		this.bot.pathfinder.isBuilding() ||
		this.bot.pathfinder.isMoving() ||
		this.bot.pathfinder.isMining();

	public async goTo(vec: Vec3): Promise<void> {
		return new Promise((promise_resolve) => {
			const goal = new goals.GoalNear(vec.x, vec.y, vec.z, 1);
			const default_move = new Movements(this.bot, this.minecraft_data!);

			this.bot.pathfinder.setMovements(default_move);
			this.bot.pathfinder.setGoal(goal);

			// a little type hack (mineflayer-pathfinder plugin adds this event but doesn't have type definitions)
			const event_name = ("goal_reached" as unknown) as keyof BotEvents;

			const listener = () => {
				this.bot.removeListener(event_name, listener);
				this.bot.setMaxListeners(this.bot.getMaxListeners() - 1);
				promise_resolve();
			};

			this.bot.setMaxListeners(this.bot.getMaxListeners() + 1);
			this.bot.addListener(event_name, listener);
		});
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
