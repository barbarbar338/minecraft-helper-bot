import { BotEvents } from "mineflayer";

/**
 * test purposes only, don't use
 */

const TestCommand: Bot.Command = {
	name: "test",
	aliases: [],
	args_definitions: [],
	master_only: false,
	execute: async ({ manager }) => {
		console.log(
			manager.bot.listeners(
				("goal_reached" as unknown) as keyof BotEvents,
			),
		);
	},
};

export default TestCommand;
