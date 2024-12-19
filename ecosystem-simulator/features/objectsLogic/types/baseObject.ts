import { PositionType } from "@/types/baseTypes";

export interface RenderParams {
  path: string;
  color: string;
  viewBox: string;
}

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
