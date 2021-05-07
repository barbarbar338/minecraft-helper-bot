import { Entity } from "prismarine-entity";

const PlayerCollectEvent: Bot.Event = {
	name: "playerCollect",
	once: false,
	execute: async (manager, collector: Entity) => {
		if (!manager.getGuarding() || collector != manager.bot.entity) return;

		const items = manager.bot.inventory.items();

		const sword = items.find((item) => item.name.includes("sword"));
		if (sword) await manager.bot.equip(sword, "hand");

		const shield = items.find((item) => item.name.includes("shield"));
		if (shield) await manager.bot.equip(shield, "off-hand");
	},
};

export default PlayerCollectEvent;
