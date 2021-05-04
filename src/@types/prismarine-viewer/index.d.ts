declare module "prismarine-viewer" {
	import { Bot } from "mineflayer";

	export interface ViewerOptions {
		viewDistance?: number;
		firstPerson?: boolean;
		port?: number;
	}

	export function mineflayer(bot: Bot, options?: ViewerOptions): void;
}
