import {
	BehaviorIdle,
	NestedStateMachine,
	StateTransition,
} from "mineflayer-statemachine";
import { Core } from "src/struct/Core";

export default function farm_state(manager: Core) {
	const enter = new BehaviorIdle();
	const exit = new BehaviorIdle();

	const transitions = [
		new StateTransition({
			parent: enter,
			child: exit,
			shouldTransition: () => !manager.getFarming().farmed_at,
		}),
	];

	const state = new NestedStateMachine(transitions, enter, exit);
	state.stateName = "Farm";
	return state;
}
