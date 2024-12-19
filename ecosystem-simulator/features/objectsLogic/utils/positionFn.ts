import { PositionKeyType } from "@/features/map/types/map";
import { PositionType } from "@/types/baseTypes";

export function calculateDistance(from: PositionType, to: PositionType) {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}
export function sortByDistanceToObj(
  a: PositionType,
  b: PositionType,
  object: PositionType
) {
  const distanceToA = calculateDistance(a, object);
  const distanceToB = calculateDistance(b, object);
  return distanceToA - distanceToB;
}
export function createPositionKey({ x, y }: PositionType): PositionKeyType {
  return `${x},${y}`;
}
export function readPositionKey(key: PositionKeyType): PositionType {
  return {
    x: parseInt(key.split(",")[0]),
    y: parseInt(key.split(",")[1]),
  } as PositionType;
}
