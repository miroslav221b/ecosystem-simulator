import { StepObjectDataType } from "@/features/stepHandler/types/step";
import { StepObjectActionTypes } from "../types/stepObjects";
import { createPositionKey } from "@/features/objectsLogic/utils/positionFn";
import { PositionType } from "@/types/baseTypes";
import { PositionKeyType } from "@/features/map/types/map";

export default function applyStepObjectChanges(
  step: StepObjectDataType,
  actions: StepObjectActionTypes[]
): StepObjectDataType {
  function getTargetKey(
    target: string | PositionType,
    state: StepObjectDataType
  ) {
    if (target instanceof Object) {
      return createPositionKey(target);
    }
    const targetObject = Object.entries(state).find(
      ([k, v]) => v.id === target
    );
    if (targetObject === undefined) return undefined;
    const [targetPosition, object] = targetObject;
    return targetPosition as PositionKeyType;
  }

  const actionFunctionsByType: Record<
    StepObjectActionTypes["type"],
    (
      state: StepObjectDataType,
      action: StepObjectActionTypes
    ) => StepObjectDataType
  > = {
    move: (state, action) => {
      if (action.type !== "move") return state;
      const startPosition = getTargetKey(action.target, state);
      if (startPosition === undefined) return state;
      const finalPosition = createPositionKey(action.to);

      if (startPosition !== finalPosition) {
        Object.defineProperty(
          state,
          finalPosition,
          Object.getOwnPropertyDescriptor(state, startPosition) as any
        );
        delete state[startPosition];
      }

      return state;
    },
    delete: (state, action) => {
      if (action.type !== "delete") return state;
      const targetPosition = getTargetKey(action.target, state);
      if (targetPosition === undefined) return state;
      delete state[targetPosition];
      return state;
    },
    create: (state, action) => {
      if (action.type !== "create") return state;
      const targetPosition = getTargetKey(action.target, state);
      if (targetPosition === undefined) return state;
      state[targetPosition] = action.object;
      return state;
    },
    update: (state, action) => {
      if (action.type !== "update") return state;
      const targetPosition = getTargetKey(action.target, state);
      if (targetPosition === undefined) return state;
      state[targetPosition] = action.newState;
      return state;
    },
  } as const;

  return actions.reduce<StepObjectDataType>(
    (accumulator, action) =>
      actionFunctionsByType[action.type](accumulator, action),
    step
  );
}
