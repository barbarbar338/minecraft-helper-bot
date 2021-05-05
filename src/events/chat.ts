import { bargs } from "bargs/dist";
import { CONFIG } from "../config";

const ChatEvent: Bot.Event = {
	name: "chat",
	once: false,
	execute: async (manager, username: string, message: string) => {
		if (!message.startsWith(CONFIG.PREFIX)) return;

		const [command, ...args] = message
			.slice(CONFIG.PREFIX.length)
			.trim()
			.split(/\s+/g);

		const cmd = manager.commands.get(command);
		if (!cmd) return;

		if (cmd.master_only && manager.getMaster().master != username)
			return manager.bot.chat(
				manager.i18n.get(manager.language, "events", "master_only", {
					prefix: CONFIG.PREFIX,
				}) as string,
			);

		try {
			await cmd.execute({
				manager,
				username,
				message,
				args: bargs(cmd.args_definitions, args),
			});
		} catch (err) {
			manager.logger.error(
				`An error occured while executing "${cmd.name}" command with "${args}" args`,
				err,
			);

			manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"events",
					"execution_error",
				) as string,
			);
		}
	},
};

export default ChatEvent;
