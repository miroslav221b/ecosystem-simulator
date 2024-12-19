import {
  AgeSetting,
  EnergySettings,
} from "@/features/objectsLogic/types/baseObject";
import { PositionType } from "@/types/baseTypes";

export type ObjectType = {
  id: string;
  type: "fox" | "rabbit" | "grass";
  speed: number;
  age: AgeSetting;
  energy: EnergySettings;
  visionRadius: number;
  generation: number;
};
export type ObjectTypeWithLocation = {
  position: PositionType;
  object: ObjectType;
};
