const MasterCommad: Bot.Command = {
	name: "master",
	aliases: [],
	args_definitions: [],
	master_only: false,
	execute: ({ manager }) => {
		const { master, master_since } = manager.getMaster();
		if (master && master_since) {
			const now = Date.now();
			const parsed = manager.parseMS(now - master_since);
			manager.bot.chat(
				`I'm currently slave of ${master}. (${parsed.days}d ${parsed.hours}h ${parsed.minutes}m ${parsed.seconds}s)`,
			);
		} else manager.bot.chat("I'm currently free.");
	},
};

export default MasterCommad;
