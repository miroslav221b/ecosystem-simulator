import { BaseMapType, PositionKeyType } from "@/features/map/types/map";
import { ObjectType } from "@/features/objectBehavior/types/objects";
export type StepObjectDataType = Record<PositionKeyType, ObjectType>;
export interface StepType {
  stepsPassed: number;
  map: BaseMapType;
  objects: StepObjectDataType;
}
