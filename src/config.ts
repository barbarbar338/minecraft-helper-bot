import { config } from "dotenv";
import { ClientOptions } from "minecraft-protocol";
import { InventoryViewerOptions } from "mineflayer-web-inventory";
import { join } from "path";
import { ViewerOptions } from "prismarine-viewer";

config();

const BOT_OPTIONS: ClientOptions = {
	host: "0.tcp.ngrok.io",
	username: "Dummy",
	port: 15040,
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
	LOCALE_PARSER_OPTIONS: {
		directory: join(__dirname, "locales"),
		defaultLocale: "en",
	},
};
