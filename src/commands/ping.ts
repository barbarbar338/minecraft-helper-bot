const PingCommad: Bot.Command = {
	name: "ping",
	aliases: ["p"],
	args_definitions: [],
	master_only: false,
	execute: ({ manager }) => {
		manager.bot.chat(
			manager.i18n.get(manager.language, "commands", "pong") as string,
		);
	},
};

export default PingCommad;
