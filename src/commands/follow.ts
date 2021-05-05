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
				manager.i18n.get(
					manager.language,
					"commands",
					"wont_follow",
					parsed,
				) as string,
			);
		} else
			manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"will_follow",
				) as string,
			);
	},
};

export default FollowCommad;
