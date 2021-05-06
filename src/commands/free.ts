const FreeCommad: Bot.Command = {
	name: "free",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: ({ manager }) => {
		const { master_since } = manager.getMaster();

		manager.reset();

		const now = Date.now();
		const parsed = manager.parseMS(now - (master_since as number));

		manager.bot.chat(
			manager.i18n.get(
				manager.language,
				"commands",
				"become_free",
				parsed,
			) as string,
		);
	},
};

export default FreeCommad;
