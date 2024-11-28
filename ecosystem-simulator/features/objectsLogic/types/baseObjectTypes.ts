import { PositionType } from "@/types/baseTypes";
import { RenderParams } from "./baseObject";
import { SurfaceType } from "@/features/map/types/map";

export enum SexTypes {
  male,
  female,
}
export enum FeedingHabitTypes {
  herbivores,
  carnivores,
}
export interface BaseObjectType {
  position: PositionType;
  renderParams: RenderParams;
  id: string;
  availableSurfaces: SurfaceType[];
}
export interface AgeSetting {
  current: number;
  pubertyAge: number;
  max: number;
}
export interface EnergySettings {
  current: number;
  max: number;
}
export interface BaseAliveObjectType extends BaseObjectType {
  visionRadius: number;
  generation: number;
  age: AgeSetting;
  sex: SexTypes;
}
export interface BaseAnimalType extends BaseAliveObjectType {
  speed: number;
  feedingHabit: FeedingHabitTypes;
  energy: EnergySettings;
}
export interface BasePlantType extends BaseAliveObjectType {}
