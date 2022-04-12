import {
	BehaviorFollowEntity,
	BehaviorGetClosestEntity,
	BehaviorIdle,
	BehaviorLookAtEntity,
	BotStateMachine,
	NestedStateMachine,
	StateMachineWebserver,
	StateTransition,
} from "mineflayer-statemachine";
import { CONFIG } from "../config";
import { Core } from "../struct/Core";
import follow_master_state from "./follow_master_state";
import collect_state from "./collect_state";
import farm_state from "./farm_state";
import guard_state from "./guard_state";

export function create_root_state(manager: Core) {
	const targets = {};

	const idleState = new BehaviorIdle();
	const lookAtPlayersState = new BehaviorLookAtEntity(manager.bot as any, targets);
	const followPlayer = new BehaviorFollowEntity(manager.bot as any, targets);
	const followMasterState = follow_master_state(manager);
	const collectState = collect_state(manager);
	const guardState = guard_state(manager);
	const farmState = farm_state(manager);
	const getClosestPlayer = new BehaviorGetClosestEntity(
		manager.bot as any,
		targets,
		(entity) => entity.type === "player",
	);

	const transitions = [
		new StateTransition({
			parent: idleState,
			child: guardState,
			shouldTransition: () => !manager.isActing(),
		}),
		new StateTransition({
			parent: guardState,
			child: farmState,
			shouldTransition: () => guardState.isFinished(),
		}),
		new StateTransition({
			parent: farmState,
			child: collectState,
			shouldTransition: () => farmState.isFinished(),
		}),
		new StateTransition({
			parent: collectState,
			child: getClosestPlayer,
			shouldTransition: () => collectState.isFinished(),
		}),
		new StateTransition({
			parent: getClosestPlayer,
			child: lookAtPlayersState,
			shouldTransition: () =>
				manager.isMoving() || followPlayer.distanceToTarget() < 5,
		}),
		new StateTransition({
			parent: lookAtPlayersState,
			child: followMasterState,
			shouldTransition: () =>
				manager.isMoving() || followPlayer.distanceToTarget() >= 5,
		}),
		new StateTransition({
			parent: followMasterState,
			child: idleState,
			shouldTransition: () =>
				!!manager.getFarming().farmed_at ||
				!!manager.getCollecting() ||
				!!manager.getGuarding() ||
				!manager.getFollowing() ||
				followMasterState.isFinished(),
		}),
	];

	const root_state = new NestedStateMachine(transitions, idleState);
	root_state.stateName = "Waiting";

	manager.statemachine = new BotStateMachine(manager.bot as any, root_state);

	const webserver = new StateMachineWebserver(
		manager.bot as any,
		manager.statemachine,
		CONFIG.STATE_MACHINE_PORT,
	);
	webserver.startServer();
}
