const ErrorEvent: Bot.Event = {
	name: "error",
	once: false,
	execute: async (manager, err: Error) => {
		manager.logger.error(err);
	},
};

export default ErrorEvent;
