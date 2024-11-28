import { PositionType } from "@/types/baseTypes";

export type SurfaceType = "land" | "water" | "mountain";
export interface BaseMapTileType {
  height: number;
  surface: SurfaceType;
  position: PositionType;
}
export type PositionKeyType = `${number},${number}`;
export type BaseMapType = {
  id: string;
  tiles: Record<PositionKeyType, BaseMapTileType>;
  size: number;
};
