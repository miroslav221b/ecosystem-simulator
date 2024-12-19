import useMap from "@/features/map/hooks/useMap";
import { readPositionKey } from "@/features/objectsLogic/utils/positionFn";
import useStepHandler from "@/features/stepHandler/hooks/useStepHandler";
import { StepObjectDataType } from "@/features/stepHandler/types/step";
import { v4 } from "uuid";
import { getObjectsAround } from "../utils/getObjectsAround";
import createObjectsActions from "@/features/objectBehavior/utils/createObjectsActions";
import { PositionKeyType, SurfaceType } from "@/features/map/types/map";
import applyStepObjectChanges from "@/features/objectBehavior/utils/applyStepObjectChanges";
import { ObjectType } from "@/features/objectBehavior/types/objects";
import { factory } from "@/features/objectBehavior/utils/fabricks";

export default function useSimulation({ mapSize = 100 }: { mapSize?: number }) {
  const { map, regenerate, getSurfaceAround } = useMap({
    defaultSize: mapSize,
  });
  const objectsDensity = 0.03;
  const stepHandler = useStepHandler({
    stepCalculation: async (step) => {
      if (step !== undefined) {
        const prevObjectsClone = structuredClone(step.objects);
        const allObjectIds = Object.values(prevObjectsClone)
          .sort((a, b) => a.speed - b.speed)
          .map((o) => o.id);

        const mutedObjects = await allObjectIds.reduce<
          Promise<StepObjectDataType>
        >(async (accumulatorP, currentObjId) => {
          const accumulator = await accumulatorP;
          const currentObject = Object.entries(accumulator).find(
            ([key, obj]) => obj.id === currentObjId
          );
          if (!currentObject) return accumulator;
          const [currentKey, currentObj]: [PositionKeyType, ObjectType] =
            currentObject as any;
          const currentPosition = readPositionKey(currentKey);
          const actions = await createObjectsActions({
            current: {
              position: currentPosition,
              object: currentObj,
            },
            surrounding: getObjectsAround(
              currentPosition,
              currentObj.visionRadius,
              accumulator
            ),
            surface: getSurfaceAround(currentPosition, currentObj.visionRadius),
          });
          return applyStepObjectChanges(accumulator, actions);
        }, Promise.resolve(prevObjectsClone));
        return {
          stepsPassed: step.stepsPassed + 1,
          map: step.map,
          objects: mutedObjects,
        };
      } else {
        const newObjects = Object.fromEntries(
          Object.entries(map.tiles)
            .filter((_) => Math.random() > 1 - objectsDensity)
            .filter(([p, { surface }]) => surface === SurfaceType.land)
            .map(([positionKey, surface]) => {
              const random = Math.random();
              let object: ObjectType | undefined = undefined;
              if (random < 0.8) {
                object = factory.grass();
              } else if (random < 0.94) {
                object = factory.rabbit();
              } else {
                object = factory.fox();
              }
              return [positionKey, object];
            })
        ) as StepObjectDataType;

        return {
          id: v4(),
          map,
          stepsPassed: 0,
          objects: newObjects,
        };
      }
    },
  });

  return {
    ...stepHandler,
    regenerateMap: regenerate,
  };
}
