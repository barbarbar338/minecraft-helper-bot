import { config } from "dotenv";
import { ClientOptions } from "minecraft-protocol";
import { InventoryViewerOptions } from "mineflayer-web-inventory";
import { ViewerOptions } from "prismarine-viewer";

config();

const BOT_OPTIONS: ClientOptions = {
	host: "localhost",
	username: "MinecraftBot",
	port: 58067,
};

const VIEWER_OPTIONS: ViewerOptions = {
	firstPerson: false,
	port: 3000,
	viewDistance: 4,
};

const INVENTORY_VIEWER_OPTION: InventoryViewerOptions = {
	port: 3001,
};

export const CONFIG = {
	BOT_OPTIONS,
	VIEWER_OPTIONS,
	INVENTORY_VIEWER_OPTION,
	PREFIX: "!",
	STATE_MACHINE_PORT: 3002,
};
