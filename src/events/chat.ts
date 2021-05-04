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
				`This command is master only. Run "${CONFIG.PREFIX}obey" command first.`,
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
				"An error occurred while running the command and the developers were notified. Please try again later.",
			);
		}
	},
};

export default ChatEvent;
