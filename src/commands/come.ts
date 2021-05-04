import { BotEvents } from "mineflayer";
import { Movements, goals } from "mineflayer-pathfinder";

const ComeCommand: Bot.Command = {
	name: "come",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: ({ manager, username }) => {
		return new Promise((resolve, reject) => {
			const default_move = new Movements(
				manager.bot,
				manager.minecraft_data!,
			);
			const target = manager.bot.players[username]
				? manager.bot.players[username].entity
				: undefined;
			if (!target) {
				manager.bot.chat("I don't see you.");
				return resolve(false);
			}
			const goal = new goals.GoalNear(
				target.position.x,
				target.position.y,
				target.position.z,
				1,
			);
			manager.bot.pathfinder.setMovements(default_move);
			manager.bot.pathfinder.setGoal(goal);
			manager.bot.chat("I am coming to you.");
			const listener = () => {
				manager.bot.chat("Here I am.");
				manager.bot.removeListener(
					("goal_reached" as unknown) as keyof BotEvents,
					listener,
				);
				resolve(true);
			};
			manager.bot.addListener(
				("goal_reached" as unknown) as keyof BotEvents,
				listener,
			);
		});
	},
};

export default ComeCommand;
