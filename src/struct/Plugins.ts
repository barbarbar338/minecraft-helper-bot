import { Plugin } from "mineflayer";
import armorManager from "mineflayer-armor-manager";
import { plugin as autoeat } from "mineflayer-auto-eat";
import { plugin as collector } from "mineflayer-collectblock";
import { pathfinder } from "mineflayer-pathfinder";
import { plugin as pvp } from "mineflayer-pvp";

export const plugins: Plugin[] = [
	collector,
	pathfinder,
	armorManager,
	autoeat,
	pvp,
];
