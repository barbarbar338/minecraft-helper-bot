const FollowCommad: Bot.Command = {
	name: "follow",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: ({ manager }) => {
		const followedAt = manager.getFollowing();
		manager.setFollowing(!followedAt);
		if (!!followedAt) {
			const now = Date.now();
			const parsed = manager.parseMS(now - followedAt);
			manager.bot.chat(
				`I won't follow you. (${parsed.days}d ${parsed.hours}h ${parsed.minutes}m ${parsed.seconds}s)`,
			);
		} else manager.bot.chat("I will follow you.");
	},
};

export default FollowCommad;
