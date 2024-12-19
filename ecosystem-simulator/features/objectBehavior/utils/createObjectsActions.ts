import { BaseMapTileType } from "@/features/map/types/map";
import { ObjectType, ObjectTypeWithLocation } from "../types/objects";
import { StepObjectActionTypes } from "../types/stepObjects";
import { PositionType } from "@/types/baseTypes";
import { v4 } from "uuid";
import { factory } from "./fabricks";

type EnvironmentType = {
  current: ObjectTypeWithLocation;
  surrounding: ObjectTypeWithLocation[];
  surface: BaseMapTileType[];
};
export default async function createObjectsActions(
  environment: EnvironmentType
): Promise<StepObjectActionTypes[]> {
  const actions: StepObjectActionTypes[] = [];
  const { current, surrounding } = environment;
  current.object.age.current = current.object.age.current + 1;
  current.object.energy.current =
    current.object.energy.current - current.object.visionRadius / 10;
  if (
    current.object.age.current >= current.object.age.max ||
    current.object.energy.current <= 0
  ) {
    //die from age or low energy
    return [die(environment)];
  }
  const { type } = current.object;
  if (type === "fox" || type === "rabbit") {
    if (
      type === "rabbit" &&
      surrounding.map((obj) => obj.object.type).includes("fox")
    ) {
      actions.push(...flee(environment));
    } else if (
      current.object.age.current >= current.object.age.pubertyAge &&
      current.object.energy.current > current.object.energy.max * 0.7 &&
      surrounding.map((obj) => obj.object.type).includes(type)
    ) {
      actions.push(...goToPartner(environment));
    } else if (
      current.object.energy.current < current.object.energy.max * 0.6 &&
      ((type === "fox" &&
        surrounding.map((obj) => obj.object.type).includes("rabbit")) ||
        (type === "rabbit" &&
          surrounding.map((obj) => obj.object.type).includes("grass")))
    ) {
      actions.push(...getFood(environment));
    } else {
      actions.push(...messAround(environment));
    }
  } else {
    if (current.object.age.current >= current.object.age.pubertyAge) {
      actions.push(...plantReproduce(environment));
    }
  }

  return actions;
}
function isSurfaceAvailable(
  position: PositionType,
  environment: EnvironmentType
) {
  const { surrounding, surface } = environment;
  const targetSurface = surface.find(
    (obj) => obj.position.x === position.x && obj.position.y === position.y
  );
  if (targetSurface === undefined) return false;
  const targetObject = surrounding.find(
    (obj) => obj.position.x === position.x && obj.position.y === position.y
  );
  return targetObject === undefined;
}
function getNeighbors(position: PositionType): PositionType[] {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
  ];

  return directions.map((dir) => ({
    x: position.x + dir.x,
    y: position.y + dir.y,
  }));
}
function findPath(
  start: PositionType,
  end: PositionType,
  environment: EnvironmentType
): PositionType[] {
  // Helper to uniquely identify positions.
  const key = (pos: PositionType) => `${pos.x},${pos.y}`;

  // Store visited positions to avoid revisiting.
  const visited = new Set<string>();

  // Queue for BFS: each entry contains the current position and the path to reach it.
  const queue: { position: PositionType; path: PositionType[] }[] = [
    { position: start, path: [start] },
  ];

  while (queue.length > 0) {
    // Dequeue the next position to process.
    const { position, path } = queue.shift()!;

    // If we've reached the target position, return the path, even if it is unavailable.
    if (position.x === end.x && position.y === end.y) {
      return path;
    }

    // Mark the current position as visited.
    visited.add(key(position));

    // Explore neighboring positions.
    const neighbors = getNeighbors(position);
    for (const neighbor of neighbors) {
      // Ignore surface availability check for the target position.
      if (
        !visited.has(key(neighbor)) &&
        (isSurfaceAvailable(neighbor, environment) ||
          key(neighbor) === key(end))
      ) {
        queue.push({ position: neighbor, path: [...path, neighbor] });
        visited.add(key(neighbor)); // Mark as visited when enqueuing.
      }
    }
  }

  // If no path is found, return an empty array.
  return [];
}
function move(
  path: PositionType[],
  environment: EnvironmentType
): PositionType {
  const truncSpeed = Math.trunc(environment.current.object.speed);
  environment.current.object.energy.current ===
    environment.current.object.energy.current -
      environment.current.object.speed;
  const finalPosition =
    path.length - 1 <= truncSpeed
      ? { ...path[path.length - 1] }
      : path[truncSpeed];
  return finalPosition as PositionType;
}
function messAround(environment: EnvironmentType): StepObjectActionTypes[] {
  const targets = shuffle(environment.surface);
  let finalTarget:
    | {
        path: PositionType[];
        tile: BaseMapTileType;
      }
    | undefined;
  for (let tile of targets) {
    if (!isSurfaceAvailable(tile.position, environment)) continue;
    const path = findPath(
      environment.current.position,
      tile.position,
      environment
    );
    if (!path || path.length === 0) continue;
    finalTarget = { tile, path };
    break;
  }
  if (finalTarget === undefined) return [];

  const finalPosition = move(finalTarget.path, environment);
  return [
    {
      type: "move",
      target: environment.current.position,
      to: finalPosition,
    },
  ];
}
function eat(food: ObjectType["type"], environment: EnvironmentType) {
  if (food === "fox") {
    environment.current.object.energy.current += 500;
  } else if (food === "grass") {
    environment.current.object.energy.current += 50;
  } else if (food === "rabbit") {
    environment.current.object.energy.current += 250;
  }
  if (
    environment.current.object.energy.current >
    environment.current.object.energy.max
  ) {
    environment.current.object.energy.current =
      environment.current.object.energy.max;
  }
}
function getFood(environment: EnvironmentType): StepObjectActionTypes[] {
  const closestFood = environment.surrounding
    .filter(
      (obj) =>
        (environment.current.object.type === "rabbit" &&
          obj.object.type === "grass") ||
        (environment.current.object.type === "fox" &&
          obj.object.type === "rabbit")
    )
    .map((obj) => {
      const path = findPath(
        environment.current.position,
        obj.position,
        environment
      );
      return {
        obj: obj,
        path: path,
      };
    })
    .filter((obj) => obj.path.length !== 0)
    .sort((a, b) => a.path.length - b.path.length)[0];

  if (closestFood === undefined) return [];
  const actions: StepObjectActionTypes[] = [];
  const finalPosition = move(closestFood.path, environment);
  if (
    finalPosition.x === closestFood.obj.position.x &&
    finalPosition.y === closestFood.obj.position.y
  ) {
    eat(closestFood.obj.object.type, environment);
    actions.push({
      type: "delete",
      target: closestFood.obj.object.type,
    });
  }
  actions.push({
    type: "move",
    target: environment.current.position,
    to: finalPosition,
  });
  return actions;
}
function die(environment: EnvironmentType): StepObjectActionTypes {
  return {
    type: "delete",
    target: environment.current.position,
  };
}
function flee(environment: EnvironmentType): StepObjectActionTypes[] {
  const closestEnemy = environment.surrounding
    .filter((obj) => obj.object.type === "fox")
    .map((obj) => {
      return {
        obj: obj,
        distance: findPath(
          environment.current.position,
          obj.position,
          environment
        ).length,
      };
    })
    .filter((o) => o.distance !== 0)
    .sort((a, b) => a.distance - b.distance)
    ?.at(0)?.obj;

  if (!closestEnemy) return [];
  const path = findPathToReachableFarthestPosition(
    environment.current.position,
    closestEnemy.position,
    environment
  );
  if (path === null) return [];
  const finalPosition = move(path, environment);
  return [
    {
      type: "move",
      target: environment.current.position,
      to: finalPosition,
    },
  ];
}
function shuffle<T>(arr: T[]): T[] {
  const array = [...arr];
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
function findPathToReachableFarthestPosition(
  start: PositionType, // Starting position (Z)
  relativeTo: PositionType, // Position to measure distance from (Y)
  environment: EnvironmentType
): PositionType[] {
  // Step 1: Get all valid positions sorted by distance from `relativeTo`.
  const sortedPositions = getSortedPositionsByDistance(relativeTo, environment);

  // Step 2: Try finding a path to each position, starting from the farthest.
  for (const farthestPosition of sortedPositions) {
    const path = findPath(start, farthestPosition, environment);
    if (path.length > 0) {
      return path; // Return the first successful path.
    }
  }

  // If no path is found, return an empty array.
  return [];
}
function getDistance(a: PositionType, b: PositionType): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
function getSortedPositionsByDistance(
  target: PositionType,
  environment: EnvironmentType
): PositionType[] {
  const validPositions = environment.surface
    .filter((tile) => isSurfaceAvailable(tile.position, environment)) // Only consider available positions.
    .map((tile) => tile.position);

  // Sort positions by distance from the target (descending order).
  return validPositions.sort(
    (a, b) => getDistance(b, target) - getDistance(a, target)
  );
}
function plantReproduce(environment: EnvironmentType): StepObjectActionTypes[] {
  return environment.surface
    .filter((tile) => isSurfaceAvailable(tile.position, environment))
    .filter((tile) => Math.random() > 0.92)
    .map((tile) => {
      return {
        type: "create",
        target: { ...tile.position },
        object: factory.grass([environment.current.object]),
      };
    });
}
function goToPartner(environment: EnvironmentType): StepObjectActionTypes[] {
  const closestPartner = environment.surrounding
    .filter((obj) => environment.current.object.type === obj.object.type)
    .map((obj) => {
      const path = findPath(
        environment.current.position,
        obj.position,
        environment
      );
      return {
        obj: obj,
        path: path,
      };
    })
    .filter((obj) => obj.path.length !== 0)
    .sort((a, b) => a.path.length - b.path.length)[0];
  if (closestPartner === undefined) return [];
  const actions: StepObjectActionTypes[] = [];
  const finalPosition = move(closestPartner.path, environment);
  if (
    finalPosition.x === closestPartner.obj.position.x &&
    finalPosition.y === closestPartner.obj.position.y
  ) {
    const partnerClone = structuredClone(closestPartner.obj.object);
    partnerClone.energy.current = partnerClone.energy.current / 3;
    environment.current.object.energy.current =
      environment.current.object.energy.current / 3;
    actions.push({
      type: "delete",
      target: closestPartner.obj.position,
    });
    getNeighbors(closestPartner.obj.position)
      .filter((tile) => isSurfaceAvailable(tile, environment))
      .filter(() => Math.random() > 0.8)
      .forEach((tile, i) => {
        if (i === 0) {
          actions.push({
            type: "create",
            target: { ...tile },
            object: partnerClone,
          });
        } else {
          const children = factory[environment.current.object.type]([
            environment.current.object,
            partnerClone,
          ]);
          actions.push({
            type: "create",
            target: { ...tile },
            object: children,
          });
        }
      });
  }
  actions.push({
    type: "move",
    target: environment.current.position,
    to: finalPosition,
  });
  return actions;
}
