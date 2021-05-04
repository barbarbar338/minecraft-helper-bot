const CollectCommad: Bot.Command = {
	name: "collect",
	aliases: [],
	args_definitions: [
		{
			name: "block",
			type: String,
			default: true,
		},
		{
			name: "count",
			type: Number,
			aliases: ["c", "n", "number", "limit", "l"],
		},
	],
	master_only: true,
	execute: async ({ manager, args }) => {
		const { block, count } = args;
		if (!block)
			return manager.bot.chat(
				`You must enter the full name of the block you want me to collect.`,
			);
		const block_data =
			manager.minecraft_data?.blocksByName[block as string];
		if (!block_data)
			return manager.bot.chat(
				"I could not find the block you specified. Enter the full Minecraft name of the block.",
			);
		manager.setFollowing(false);
		manager
			.collectBlock(manager.bot, block_data.id, count as number)
			.then((is_collected) => {
				if (is_collected)
					manager.bot.chat(
						"Block(s) has been successfully collected.",
					);
			});
	},
};

export default CollectCommad;
