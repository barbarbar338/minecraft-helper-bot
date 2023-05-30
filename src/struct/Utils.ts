import { IndexedData } from "minecraft-data";
import { Vec3 } from "vec3";
import { CONFIG } from "../config";
import { Core } from "./Core";

export class Utils {
	private master?: string;
	private master_since?: number;
	private followed_at?: number;
	private collected_at?: number;
	private fall_at?: number;
	private guard_at?: number;
	private farming?: string;
	private seed?: string;
	private farmed_at?: number;
	private farming_chest?: Vec3;

	public getFarming() {
		const { farming, farmed_at, seed, farming_chest } = this;
		return { farming, farmed_at, seed, farming_chest };
	}

	public setFarming(farming?: string, seed?: string, farming_chest?: Vec3) {
		this.farming = farming;
		this.seed = seed;
		this.farming_chest = farming_chest;
		this.farmed_at = farming ? Date.now() : undefined;
	}

	public getMaster() {
		const { master, master_since } = this;
		return { master, master_since };
	}

	public getFollowing() {
		return this.followed_at;
	}

	public getGuarding() {
		return this.guard_at;
	}

	public getCollecting() {
		return this.collected_at;
	}

	public getFalling() {
		return this.fall_at;
	}

	public setMaster(master?: string) {
		this.master = master;
		this.master_since = master ? Date.now() : undefined;
	}

	public setFollowing(is_following: boolean) {
		this.followed_at = is_following ? Date.now() : undefined;
	}

	public setGuarding(is_following: boolean) {
		this.guard_at = is_following ? Date.now() : undefined;
	}

	public setCollecting(is_collecting: boolean) {
		this.collected_at = is_collecting ? Date.now() : undefined;
	}

	public setFalling(is_falling: boolean) {
		this.fall_at = is_falling ? Date.now() : undefined;
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

	public collectBlock(manager: Core, blockID: number, count?: number) {
		const limit = count || 1;

		return new Promise((resolve, reject) => {
			const blocks = manager.bot.findBlocks({
				matching: blockID,
				maxDistance: 64,
				count: limit,
			});

			if (blocks.length < 1) {
				manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"utils",
						"no_blocks_nearby",
					) as string,
				);
				resolve(false);
			} else {
				const targets = [];

				for (let i = 0; i < Math.min(blocks.length, limit); i++) {
					targets.push(manager.bot.blockAt(blocks[i]));
				}

				manager.bot.chat(
					manager.i18n.get(
						manager.language,
						"utils",
						"found_blocks",
						{
							count: targets.length.toString(),
						},
					) as string,
				);

				manager.setCollecting(true);

				manager.bot.collectBlock.collect(targets, (err) => {
					manager.setCollecting(false);
					if (err) {
						reject(err);
					} else resolve(true);
				});
			}
		});
	}

	public fetchChests(manager: Core, minecraft_data: IndexedData) {
		manager.bot.collectBlock.chestLocations = manager.bot.findBlocks({
			matching: minecraft_data.blocksByName.chest.id,
			maxDistance: 32,
			count: 999999,
		});

		if (manager.bot.collectBlock.chestLocations && manager.bot.collectBlock.chestLocations.length)
			manager.bot.chat(
				manager.i18n.get(manager.language, "utils", "no_chest_found", {
					prefix: CONFIG.PREFIX,
				}) as string,
			);
		else
			manager.bot.chat(
				manager.i18n.get(manager.language, "utils", "found_chest", {
					count: manager.bot.collectBlock.chestLocations.length.toString(),
				}) as string,
			);
	}

	public resetStates() {
		this.setCollecting(false);
		this.setFalling(false);
		this.setFollowing(false);
		this.setGuarding(false);
		this.setFarming();
	}

	public reset() {
		this.resetStates();
		this.setMaster();
	}
}
