const EndEvent: Bot.Event = {
	name: "end",
	once: false,
	execute: async (manager) => {
		manager.logger.error("Bot closed");
	},
};

export default EndEvent;
