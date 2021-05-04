import { IndexedData } from "minecraft-data";

const ChestCommand: Bot.Command = {
	name: "chest",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: ({ manager }) => {
		manager.fetchChests(manager.bot, manager.minecraft_data as IndexedData);
	},
};

export default ChestCommand;
