import { CONFIG } from "../config";

const FarmCommand: Bot.Command = {
	name: "farm",
	aliases: [],
	args_definitions: [
		{
			name: "crop",
			type: String,
			default: true,
		},
		{
			name: "seed",
			type: String,
			aliases: ["s"],
		},
	],
	master_only: true,
	execute: ({ manager, args }) => {
		if (manager.getCollecting() || manager.getFalling())
			return manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"is_acting",
				) as string,
			);

		const farm = manager.getFarming();

		if (!farm.farmed_at) {
			const chest = manager.bot.findBlock({
				matching: manager.minecraft_data!.blocksByName.chest.id,
				maxDistance: 16,
			});

			if (!chest)
				return manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"no_chests_found",
						{ prefix: CONFIG.PREFIX },
					) as string,
				);

			const { crop, seed } = args;

			if (!crop)
				return manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"specify_crop",
					) as string,
				);

			const crop_data =
				manager.minecraft_data?.itemsByName[crop as string];
			if (!crop_data)
				return manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"specify_valid_crop",
					) as string,
				);

			if (!seed)
				return manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"specify_seed",
					) as string,
				);

			const seed_data =
				manager.minecraft_data?.itemsByName[seed as string];
			if (!seed_data)
				return manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"specify_valid_seed",
					) as string,
				);

			manager.setFarming(crop as string, seed as string, chest.position);

			manager.bot.chat(
				manager.i18n.get(manager.language, "commands", "will_farm", {
					crop,
					seed,
				}) as string,
			);
		} else {
			manager.setFarming();

			const now = Date.now();
			const parsed = manager.parseMS(now - farm.farmed_at);

			manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"wont_farm",
					parsed,
				) as string,
			);
		}
	},
};

export default FarmCommand;
