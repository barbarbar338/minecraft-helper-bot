const FreeCommad: Bot.Command = {
	name: "free",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: ({ manager }) => {
		const { master_since } = manager.getMaster();
		manager.setMaster();
		manager.setFollowing(false);
		const now = Date.now();
		const parsed = manager.parseMS(now - (master_since as number));
		manager.bot.chat(
			`I am free from now. (${parsed.days}d ${parsed.hours}h ${parsed.minutes}m ${parsed.seconds}s)`,
		);
	},
};

export default FreeCommad;
