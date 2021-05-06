import { CONFIG } from "../config";
import { Vec3 } from "vec3";
import { Core } from "./Core";

export async function farming(manager: Core) {
	if (manager.getFarming().farmed_at) {
		if (
			manager.bot.inventory.slots.filter((item) => item == null).length <
			11
		)
			await depositLoop(manager);
		else await farmLoop(manager);
	}

	setTimeout(() => farming(manager), 1000);
}

async function depositLoop(manager: Core) {
	const vec = manager.getFarming().farming_chest;
	if (!vec)
		return manager.bot.chat(
			manager.i18n.get(manager.language, "commands", "no_chests_found", {
				prefix: CONFIG.PREFIX,
			}) as string,
		);

	const chest = manager.bot.blockAt(vec);
	if (!chest)
		return manager.bot.chat(
			manager.i18n.get(manager.language, "commands", "no_chests_found", {
				prefix: CONFIG.PREFIX,
			}) as string,
		);

	if (manager.bot.entity.position.distanceTo(vec) < 2) {
		manager.bot.setControlState("forward", false);

		const window = await manager.bot.openChest(chest);

		for (const slot of manager.bot.inventory.slots) {
			if (slot && slot.name == manager.getFarming().farming) {
				try {
					await window.deposit(slot.type, null, slot.count);
				} catch (err) {
					manager.bot.chat(
						manager.i18n.get(
							manager.language,
							"utils",
							"chest_full",
							{
								prefix: CONFIG.PREFIX,
							},
						) as string,
					);

					manager.setFarming();
					break;
				}
			}
		}

		window.close();
	} else {
		manager.bot.lookAt(vec);
		manager.bot.setControlState("forward", true);
	}
}

async function farmLoop(manager: Core) {
	const harvest = readyCrop(manager);

	if (harvest) {
		manager.bot.lookAt(harvest.position);

		try {
			if (manager.bot.entity.position.distanceTo(harvest.position) < 2) {
				manager.bot.setControlState("forward", false);

				await manager.bot.dig(harvest);

				if (
					!manager.bot.heldItem ||
					manager.bot.heldItem.name != manager.getFarming().seed
				)
					for (const item of manager.bot.inventory.slots) {
						if (item && item.name === manager.getFarming().seed) {
							await manager.bot.equip(item, "hand");
							break;
						}
					}

				if (!manager.bot.heldItem) return;

				const dirt = manager.bot.blockAt(
					harvest.position.offset(0, -1, 0),
				);
				if (!dirt) return;
				await manager.bot
					.placeBlock(dirt, new Vec3(0, 1, 0))
					.catch(() => undefined); // idk why but bot places seed but throws error
			} else manager.bot.setControlState("forward", true);
		} catch (err) {
			manager.logger.error(err);
		}
	}
}

function readyCrop(manager: Core) {
	return manager.bot.findBlock({
		matching: (block) => {
			return (
				block.name == manager.getFarming().farming &&
				block.metadata == 7
			);
		},
	});
}
