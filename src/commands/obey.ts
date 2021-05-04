const ObeyCommad: Bot.Command = {
	name: "obey",
	aliases: [],
	args_definitions: [],
	master_only: false,
	execute: ({ manager, username }) => {
		const { master, master_since } = manager.getMaster();
		if (master && master_since) {
			const now = Date.now();
			const parsed = manager.parseMS(now - master_since);
			manager.bot.chat(
				`I'm currently slave of ${master}. (${parsed.days}d ${parsed.hours}h ${parsed.minutes}m ${parsed.seconds}s)`,
			);
		} else {
			manager.setMaster(username);
			manager.bot.chat("From now, I'll do whatever you say.");
		}
	},
};

export default ObeyCommad;
