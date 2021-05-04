import {
	BehaviorFollowEntity,
	BehaviorGetClosestEntity,
	BehaviorIdle,
	BehaviorLookAtEntity,
	NestedStateMachine,
	StateTransition,
} from "mineflayer-statemachine";
import { Core } from "src/struct/Core";

export default function follow_master_state(manager: Core) {
	const targets = {};
	const enter = new BehaviorIdle();
	const exit = new BehaviorIdle();
	const followPlayer = new BehaviorFollowEntity(manager.bot, targets);
	const getClosestPlayer = new BehaviorGetClosestEntity(
		manager.bot,
		targets,
		(entity) =>
			entity.type === "player" &&
			entity.username === manager.getMaster().master,
	);
	const lookAtPlayer = new BehaviorLookAtEntity(manager.bot, targets);

	const transitions = [
		new StateTransition({
			parent: enter,
			child: getClosestPlayer,
			shouldTransition: () => true,
		}),
		new StateTransition({
			parent: getClosestPlayer,
			child: followPlayer,
			shouldTransition: () => followPlayer.distanceToTarget() >= 3,
		}),
		new StateTransition({
			parent: getClosestPlayer,
			child: lookAtPlayer,
			shouldTransition: () => followPlayer.distanceToTarget() < 3,
		}),
		new StateTransition({
			parent: followPlayer,
			child: lookAtPlayer,
			shouldTransition: () => followPlayer.distanceToTarget() < 3,
		}),
		new StateTransition({
			parent: lookAtPlayer,
			child: exit,
			shouldTransition: () => lookAtPlayer.distanceToTarget() >= 3,
		}),
	];
	const state = new NestedStateMachine(transitions, enter, exit);
	state.stateName = "Follow Master";
	return state;
}
