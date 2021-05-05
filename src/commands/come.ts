import { BotEvents } from "mineflayer";
import { Movements, goals } from "mineflayer-pathfinder";

const ComeCommand: Bot.Command = {
	name: "come",
	aliases: [],
	args_definitions: [],
	master_only: true,
	execute: ({ manager, username }) => {
		return new Promise((resolve) => {
			if (manager.getFollowing())
				return manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"already_following",
					) as string,
				);

			const target = manager.bot.players[username]
				? manager.bot.players[username].entity
				: undefined;
			if (!target) {
				manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"dont_see",
					) as string,
				);
				return resolve(false);
			}

			const goal = new goals.GoalNear(
				target.position.x,
				target.position.y,
				target.position.z,
				1,
			);
			const default_move = new Movements(
				manager.bot,
				manager.minecraft_data!,
			);

			manager.bot.pathfinder.setMovements(default_move);
			manager.bot.pathfinder.setGoal(goal);

			manager.bot.chat(
				manager.i18n.get(
					manager.language,
					"commands",
					"coming",
				) as string,
			);

			// a little type hack (mineflayer-pathfinder plugin adds this event but doesn't have type definitions)
			const event_name = ("goal_reached" as unknown) as keyof BotEvents;

			const listener = () => {
				manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"commands",
						"here_it_is",
					) as string,
				);
				manager.bot.removeListener(event_name, listener);
				resolve(true);
			};
			manager.bot.addListener(event_name, listener);
		});
	},
};

export default ComeCommand;
