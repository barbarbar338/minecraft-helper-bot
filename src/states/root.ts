import {
	BehaviorIdle,
	BotStateMachine,
	NestedStateMachine,
	StateMachineWebserver,
	StateTransition,
} from "mineflayer-statemachine";
import { CONFIG } from "../config";
import { Core } from "../struct/Core";
import follow_master_state from "./follow_master_state";

export function create_root_state(manager: Core) {
	const idleState = new BehaviorIdle();
	const followMasterState = follow_master_state(manager);
	const transitions = [
		new StateTransition({
			parent: idleState,
			child: followMasterState,
			shouldTransition: () => !!manager.getFollowing(),
		}),
		new StateTransition({
			parent: followMasterState,
			child: idleState,
			shouldTransition: () => followMasterState.isFinished(),
		}),
	];
	const root_state = new NestedStateMachine(transitions, idleState);
	root_state.stateName = "Waiting";
	manager.statemachine = new BotStateMachine(manager.bot, root_state);
	const webserver = new StateMachineWebserver(
		manager.bot,
		manager.statemachine,
		CONFIG.STATE_MACHINE_PORT,
	);
	webserver.startServer();
}
