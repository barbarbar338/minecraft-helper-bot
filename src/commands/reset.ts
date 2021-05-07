const ResetCommand: Bot.Command = {
	name: "ping",
	aliases: ["r"],
	args_definitions: [],
	master_only: true,
	execute: ({ manager }) => {
		manager.resetStates();
		manager.bot.chat(
			manager.i18n.get(manager.language, "commands", "reset") as string,
		);
	},
};

export default ResetCommand;
