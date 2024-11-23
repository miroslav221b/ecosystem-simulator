import { ReactElement } from "react";

export type SexTypes = "male" | "female";
export type FeedingHabitTypes = "herbivores" | "carnivores";
export type SurfaceType = "land" | "water";
export interface PositionType {
  x: number;
  y: number;
}

export interface AgeSetting {
  current: number;
  max: number;
}
export interface BaseObjectType {
  position: PositionType;
  renderFunction: () => ReactElement;
}
export interface BaseMapTileType {
  height: number;
  surface: SurfaceType;
}
export type BaseMapType = BaseMapTileType[][];

export interface BaseAnimalType extends BaseObjectType {
  speed: number;
  visionRadius: number;
  sex: SexTypes;
  age: AgeSetting;
  feedingHabit: FeedingHabitTypes;
}
export interface MapType {}
export interface BasePlantType extends BaseObjectType {}
