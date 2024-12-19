import { ObjectTypeWithLocation } from "@/features/objectBehavior/types/objects";
import { createPositionKey } from "@/features/objectsLogic/utils/positionFn";
import { StepObjectDataType } from "@/features/stepHandler/types/step";
import { PositionType } from "@/types/baseTypes";

export function getObjectsAround(
  position: PositionType,
  radius: number,
  allObjects: StepObjectDataType
): ObjectTypeWithLocation[] {
  const objectsInVision: ObjectTypeWithLocation[] = [];
  for (let y = position.y - radius; y < position.y + radius; y++) {
    for (let x = position.x - radius; x < position.x + radius; x++) {
      const object = allObjects[createPositionKey({ x, y })];
      if (object !== undefined) {
        objectsInVision.push({ position: { x, y }, object });
      }
    }
  }
  return objectsInVision;
}
