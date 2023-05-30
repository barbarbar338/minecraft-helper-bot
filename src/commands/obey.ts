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
				manager.i18n.get(manager.language, "commands", "slave_of", {
					master,
					days: parsed.days.toString(),
					hours: parsed.hours.toString(),
					minutes: parsed.minutes.toString(),
					seconds: parsed.seconds.toString(),
				}) as string,
			);
		} else {
			manager.setMaster(username);

			manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"obey_success",
				) as string,
			);
		}
	},
};

export default ObeyCommad;
