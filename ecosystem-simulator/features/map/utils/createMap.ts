import { v4 } from "uuid";
import { BaseMapTileType, BaseMapType, PositionKeyType } from "../types/map";
import { PositionType } from "@/types/baseTypes";
import { createPositionKey } from "@/features/objectsLogic/utils/positionFn";

type ParamsType = {
  size: number;
  waterLevel: number;
  mountainLevel: number;
  getPerlin: (x: number, y: number) => number;
};
export function createMap(params: ParamsType): BaseMapType {
  const { size, getPerlin, waterLevel, mountainLevel } = params;
  const mapTiles: BaseMapType["tiles"] = {};
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = getPerlin(x, y);
      const position: PositionType = { x: x, y: y };
      const mapTile: BaseMapTileType = {
        height: value,
        surface:
          value < waterLevel
            ? "water"
            : value > mountainLevel
            ? "mountain"
            : "land",
        position,
      };
      mapTiles[createPositionKey(position)] = mapTile;
    }
  }
  return {
    id: v4(),
    size,
    tiles: mapTiles,
  };
}
