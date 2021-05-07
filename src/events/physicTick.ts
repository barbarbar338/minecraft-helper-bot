const PhysicsTickEvent: Bot.Event = {
	name: "physicsTick",
	once: false,
	execute: async (manager) => {
		if (!manager.getGuarding()) return;

		if (manager.bot.pvp.target) return;
		if (manager.bot.pathfinder.isMoving()) return;

		const entity = manager.bot.nearestEntity();
		if (entity)
			manager.bot.lookAt(entity.position.offset(0, entity.height, 0));

		const mob = manager.bot.nearestEntity(
			(e) =>
				e.type === "mob" &&
				e.position.distanceTo(manager.bot.entity.position) < 16 &&
				e.mobType !== "Armor Stand",
		);
		if (mob) manager.bot.pvp.attack(mob);
		else {
			const { master } = manager.getMaster();
			if (master) {
				const target = manager.bot.players[master]
					? manager.bot.players[master].entity
					: undefined;
				if (
					target &&
					target.position.distanceTo(manager.bot.entity.position) > 3
				) {
					await manager.goTo(target.position);
				}
			}
		}
	},
};

export default PhysicsTickEvent;
