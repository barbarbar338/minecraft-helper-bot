import {
	BehaviorFollowEntity,
	BehaviorGetClosestEntity,
	BehaviorIdle,
	BehaviorLookAtEntity,
	NestedStateMachine,
	StateTransition,
} from "mineflayer-statemachine";
import { Core } from "src/struct/Core";

export default function collect_state(manager: Core) {
	const enter = new BehaviorIdle();
	const exit = new BehaviorIdle();

	const transitions = [
		new StateTransition({
			parent: enter,
			child: exit,
			shouldTransition: () => !manager.getCollecting(),
		}),
	];

	const state = new NestedStateMachine(transitions, enter, exit);
	state.stateName = "Collect";
	return state;
}
