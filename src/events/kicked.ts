const KickedEvent: Bot.Event = {
	name: "kicked",
	once: false,
	execute: async (manager, reason: string, logged_in: boolean) => {
		manager.logger.warning(
			`Kicked from server. Reason: ${reason} (${logged_in})`,
		);
	},
};

export default KickedEvent;
