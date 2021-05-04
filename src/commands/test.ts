import { Vec3 } from "vec3";

/**
 * test purposes only, don't use
 */

const TestCommand: Bot.Command = {
	name: "test",
	aliases: [],
	args_definitions: [],
	master_only: false,
	execute: async ({ manager }) => {
		const block = manager.bot.blockAt(new Vec3(2, 61, 3));
		if (!block) return;
		const chest = await manager.bot.openChest(block);
		const random = manager.bot.inventory.items()[0];
		await chest
			.deposit(random?.type, random?.metadata, random?.count)
			.catch((err) => {
				console.log(random, err);
			});
		chest.close();
	},
};

export default TestCommand;
