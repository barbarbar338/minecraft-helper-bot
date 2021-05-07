const ComeCommand: Bot.Command = {
	name: "come",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: async ({ manager, username }) => {
		if (manager.getFollowing())
			return manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"already_following",
				) as string,
			);

		if (
			manager.getCollecting() ||
			manager.getFalling() ||
			manager.getFarming().farmed_at ||
			manager.getGuarding()
		)
			return manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"is_acting",
				) as string,
			);

		const target = manager.bot.players[username]
			? manager.bot.players[username].entity
			: undefined;
		if (!target) {
			manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"dont_see",
				) as string,
			);
			return;
		}

		manager.bot.chat(
			manager.i18n.get(manager.language, "commands", "coming") as string,
		);

		await manager.goTo(target.position);

		manager.bot.chat(
			manager.i18n.get(
				manager.language,
				"commands",
				"here_it_is",
			) as string,
		);
	},
};

export default ComeCommand;
