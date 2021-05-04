import { IndexedData } from "minecraft-data";
import { Bot } from "mineflayer";
import { CONFIG } from "../config";

export class Utils {
	private master?: string;
	private master_since?: number;
	private followed_at?: number;

	public getMaster() {
		const { master, master_since } = this;
		return { master, master_since };
	}

	public getFollowing() {
		return this.followed_at;
	}

	public setMaster(master?: string) {
		this.master = master;
		this.master_since = master ? Date.now() : undefined;
	}

	public setFollowing(is_following: boolean) {
		this.followed_at = is_following ? Date.now() : undefined;
	}

	public parseMS(ms: number) {
		return {
			days: Math.trunc(ms / 86400000),
			hours: Math.trunc(ms / 3600000) % 24,
			minutes: Math.trunc(ms / 60000) % 60,
			seconds: Math.trunc(ms / 1000) % 60,
			milliseconds: Math.trunc(ms) % 1000,
			microseconds: Math.trunc(ms * 1000) % 1000,
			nanoseconds: Math.trunc(ms * 1e6) % 1000,
		};
	}

	public collectBlock(bot: Bot, blockID: number, count?: number) {
		const limit = count || 1;
		return new Promise((resolve, reject) => {
			const blocks = bot.findBlocks({
				matching: blockID,
				maxDistance: 64,
				count: limit,
			});
			if (blocks.length < 1) {
				bot.chat("I don't see that block nearby.");
				resolve(false);
			} else {
				const targets = [];
				for (let i = 0; i < Math.min(blocks.length, limit); i++) {
					targets.push(bot.blockAt(blocks[i]));
				}
				bot.chat(
					`Found ${targets.length} block(s), starting to collect them.`,
				);
				bot.collectBlock.collect(targets, (err) => {
					if (err) {
						console.log(err);
						reject(err);
					} else resolve(true);
				});
			}
		});
	}

	public fetchChests(bot: Bot, minecraft_data: IndexedData) {
		bot.collectBlock.chestLocations = bot.findBlocks({
			matching: minecraft_data.blocksByName.chest.id,
			maxDistance: 32,
			count: 999999,
		});
		if (bot.collectBlock.chestLocations.length === 0) {
			bot.chat(
				`I don't see any chests nearby. You may need to assist me when my inventory is full. (or place some chests and use the "${CONFIG.PREFIX}chest" command.)`,
			);
		} else
			bot.chat(
				`I see ${bot.collectBlock.chestLocations.length} chest(s) nearby. I'll use them when my inventory is full.`,
			);
	}
}
