import { pathfinder } from "mineflayer-pathfinder";
import armorManager from "mineflayer-armor-manager";
import { plugin as collector } from "mineflayer-collectblock";
import autoeat from "mineflayer-auto-eat";
import { plugin as pvp } from "mineflayer-pvp";

export const plugins = [
	// Plugin "mineflayer-collectblock" is currently broken. See "https://github.com/PrismarineJS/mineflayer-collectblock/issues/65" for a workaround and the cause of the error.
	(collector as unknown) as typeof pathfinder, // some type hacks
	pathfinder,
	armorManager,
	autoeat,
	(pvp as unknown) as typeof pathfinder, // some type hacks
];
