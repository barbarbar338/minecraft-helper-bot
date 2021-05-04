import {
	BehaviorFollowEntity,
	BehaviorGetClosestEntity,
	BehaviorIdle,
	BehaviorLookAtEntity,
	BotStateMachine,
	EntityFilters,
	NestedStateMachine,
	StateMachineWebserver,
	StateTransition,
} from "mineflayer-statemachine";
import { CONFIG } from "../config";
import { Core } from "../struct/Core";
import follow_master_state from "./follow_master_state";

export function create_root_state(manager: Core) {
	const targets = {};
	const idleState = new BehaviorIdle();
	const lookAtPlayersState = new BehaviorLookAtEntity(manager.bot, targets);
	const followPlayer = new BehaviorFollowEntity(manager.bot, targets);
	const followMasterState = follow_master_state(manager);
	const getClosestPlayer = new BehaviorGetClosestEntity(
		manager.bot,
		targets,
		(entity) => entity.type === "player",
	);

	const transitions = [
		new StateTransition({
			parent: idleState,
			child: getClosestPlayer,
			shouldTransition: () => true,
		}),
		new StateTransition({
			parent: getClosestPlayer,
			child: lookAtPlayersState,
			shouldTransition: () =>
				!!manager.getFollowing() || followPlayer.distanceToTarget() < 5,
		}),
		new StateTransition({
			parent: lookAtPlayersState,
			child: followMasterState,
			shouldTransition: () =>
				!!manager.getFollowing() ||
				followPlayer.distanceToTarget() >= 5,
		}),
		new StateTransition({
			parent: followMasterState,
			child: idleState,
			shouldTransition: () =>
				!manager.getFollowing() || followMasterState.isFinished(),
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
