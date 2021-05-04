import { mineflayer as viewer } from "prismarine-viewer";
//import inventory from "mineflayer-web-inventory";
import { CONFIG } from "../config";
import { create_root_state } from "../states/root";
import minecraftData from "minecraft-data";

const SpawnEvent: Bot.Event = {
	name: "spawn",
	once: true,
	execute: async (manager) => {
		manager.minecraft_data = minecraftData(manager.bot.version);

		viewer(manager.bot, CONFIG.VIEWER_OPTIONS);

		// causes error (waiting for plugin update)
		//inventory(manager.bot, CONFIG.INVENTORY_VIEWER_OPTION);

		create_root_state(manager);

		manager.fetchChests(manager.bot, manager.minecraft_data);
		manager.logger.success("Bot successfully spawned");
	},
};

export default SpawnEvent;
