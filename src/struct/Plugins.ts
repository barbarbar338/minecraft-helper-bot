import { pathfinder } from "mineflayer-pathfinder";
import armorManager from "mineflayer-armor-manager";
import { plugin as collector } from "mineflayer-collectblock";
import autoeat from "mineflayer-auto-eat";
import { plugin as pvp } from "mineflayer-pvp";

export const plugins = [
	(collector as unknown) as typeof pathfinder, // some type hacks
	pathfinder,
	armorManager,
	autoeat,
	(pvp as unknown) as typeof pathfinder, // some type hacks
];
