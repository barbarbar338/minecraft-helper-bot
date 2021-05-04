declare module "mineflayer-web-inventory" {
	import { Bot } from "mineflayer";

	export interface InventoryViewerOptions {
		port?: number;
		path?: string;
		startOnLoad?: boolean;
	}

	export default function viewer(
		bot: Bot,
		options?: InventoryViewerOptions,
	): void;
}
