const GuardCommand: Bot.Command = {
	name: "guard",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: async ({ manager }) => {
		if (
			manager.getCollecting() ||
			manager.getFalling() ||
			manager.getFarming().farmed_at
		)
			return manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"is_acting",
				) as string,
			);

		const guard_at = manager.getGuarding();

		if (!guard_at) {
			manager.setGuarding(true);

			const items = manager.bot.inventory.items();

			const sword = items.find((item) => item.name.includes("sword"));
			if (sword) await manager.bot.equip(sword, "hand");

			const shield = items.find((item) => item.name.includes("shield"));
			if (shield) manager.bot.equip(shield, "off-hand");

			manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"will_guard",
				) as string,
			);
		} else {
			manager.setGuarding(false);

			const now = Date.now();
			const parsed = manager.parseMS(now - guard_at);

			manager.bot.chat(
				manager.i18n.get(manager.language, "commands", "wont_guard", {
					days: parsed.days.toString(),
					hours: parsed.hours.toString(),
					minutes: parsed.minutes.toString(),
					seconds: parsed.seconds.toString(),
				}) as string,
			);
		}
	},
};

export default GuardCommand;
