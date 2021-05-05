import { BotEvents } from "mineflayer";
import { Core } from "../../struct/Core";
import { Result, OptionDefinitions } from "bargs";
import { Vec3 } from "vec3";
import { goals, Movements } from "mineflayer-pathfinder";
export {};

declare module "mineflayer" {
	type errFN = (err: any) => void;

	type collectFN = (block: any, errfn: errFN) => void;

	class Bot {
		public collectBlock: {
			collect: collectFN;
			chestLocations?: Vec3[];
		};

		public autoEat: {
			options: {
				priotpriority?: "saturation" | "foodPoints";
				startAt?: number;
			};
		};

		public pathfinder: {
			setMovements: (movements: Movements) => void;
			setGoal: (goal: goals.GoalNear) => void; // hardcoded for now
			isMoving: () => boolean;
			isMining: () => boolean;
			isBuilding: () => boolean;
		};
	}
}

declare global {
	namespace Bot {
		interface Event {
			name: keyof BotEvents;
			once: boolean;
			execute: (manager: Core, ...args: any[]) => any;
		}

		export interface CommandArgs {
			manager: Core;
			username: string;
			message: string;
			args: Result;
		}

		interface Command {
			name: string;
			aliases: string[];
			args_definitions: OptionDefinitions;
			master_only: boolean;
			execute: (command_args: CommandArgs) => any;
		}
	}
}
