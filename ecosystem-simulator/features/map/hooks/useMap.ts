import usePerlinNoise from "@/hooks/usePerlinNoise";

import { useMemo, useState } from "react";
import { createMap } from "../utils/createMap";
import { BaseMapTileType, BaseMapType } from "../types/map";
import { PositionType } from "@/types/baseTypes";
import { createPositionKey } from "@/features/objectsLogic/utils/positionFn";
export default function useMap({ defaultSize = 20 }: { defaultSize?: number }) {
  const { get: getPerlin, regenerate, id: perlinId } = usePerlinNoise();
  const [waterLevel, setWaterLevel] = useState<number>(0.3); //between 0 and 1
  const [mountainLevel, setMountainLevel] = useState<number>(0.8); //between 0 and 1
  const [size, setSize] = useState<number>(defaultSize);
  const map = useMemo<BaseMapType>(
    () => createMap({ size, waterLevel, getPerlin, mountainLevel }),
    [size, waterLevel, perlinId]
  );

  function getSurfaceAround(
    position: PositionType,
    radius: number
  ): BaseMapTileType[] {
    const tiles: BaseMapTileType[] = [];

    for (let y = position.y - radius; y <= position.y + radius; y++) {
      for (let x = position.x - radius; x <= position.x + radius; x++) {
        const tile = map.availableTiles[createPositionKey({ x: x, y: y })];
        if (tile !== undefined) {
          tiles.push(tile);
        }
      }
    }
    return tiles;
  }

  return {
    map,
    getSurfaceAround,
    setMountainLevel,
    setWaterLevel,
    waterLevel,
    size,
    regenerate,
    setSize,
  };
}
