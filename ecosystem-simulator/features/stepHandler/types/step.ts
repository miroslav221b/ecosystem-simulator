import { BaseMapType, PositionKeyType } from "@/features/map/types/map";
import { Fox, Rabbit } from "@/features/objectsLogic/BaseAnimalClass";
import { Grass } from "@/features/objectsLogic/BasePlantClass";
export type StepObjectType = Fox | Rabbit | Grass;
export type StepObjectDataType = Record<PositionKeyType, StepObjectType>;
export interface StepType {
  id: string;
  stepsPassed: number;
  map: BaseMapType;
  objects: StepObjectDataType;
}
