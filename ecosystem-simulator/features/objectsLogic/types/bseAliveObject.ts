import { SurfaceType } from "@/features/map/types/map";
import {
  AgeSetting,
  BaseObjectType,
  EnergySettings,
  FeedingHabitTypes,
  SexTypes,
} from "./baseObject";

export interface BaseAliveObjectType extends BaseObjectType {
  visionRadius: number;
  generation: number;
  age: AgeSetting;
  speed: number;
  availableSurfaces: SurfaceType[];
}
export interface BaseAnimalType extends BaseAliveObjectType {
  feedingHabit: FeedingHabitTypes;
  energy: EnergySettings;
}
export interface BasePlantType extends BaseAliveObjectType {}
