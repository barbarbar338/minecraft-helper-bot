const PingCommad: Bot.Command = {
	name: "ping",
	aliases: ["p"],
	args_definitions: [],
	master_only: false,
	execute: ({ manager }) => {
		manager.bot.chat("Pong!");
	},
};

export default PingCommad;
