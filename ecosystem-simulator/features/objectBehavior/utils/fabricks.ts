import { v4 } from "uuid";
import { ObjectType } from "../types/objects";

export const factory: Record<
  ObjectType["type"],
  (parents?: ObjectType[]) => ObjectType
> = {
  rabbit: (parents?: ObjectType[]) => {
    if (parents) {
      return {
        id: v4(),
        type: "rabbit",
        speed:
          parents.reduce((previousValue, currentValue) => {
            return currentValue.speed + previousValue;
          }, 0) /
            parents.length +
          (Math.random() - 0.5),
        visionRadius: 5,
        generation: parents[0].generation + 1,
        age: {
          max: 250,
          pubertyAge: 30,
          current: 1,
        },
        energy: {
          current: 100,
          max: 300,
        },
      };
    } else {
      return {
        id: v4(),
        type: "rabbit",
        speed: 1 + Math.random(),
        visionRadius: 5,
        generation: 0,
        age: {
          max: 250,
          pubertyAge: 30,
          current: 1,
        },
        energy: {
          current: 100,
          max: 300,
        },
      };
    }
  },
  fox: (parents?: ObjectType[]) => {
    if (parents) {
      return {
        id: v4(),
        type: "fox",
        speed:
          parents.reduce((previousValue, currentValue) => {
            return currentValue.speed + previousValue;
          }, 0) /
            parents.length +
          (Math.random() - 0.5),
        visionRadius: 5,
        generation: parents[0].generation + 1,
        age: {
          max: 400,
          pubertyAge: 50,
          current: 1,
        },
        energy: {
          current: 200,
          max: 500,
        },
      };
    } else {
      return {
        id: v4(),
        type: "fox",
        speed: 1 + Math.random(),
        visionRadius: 5,
        generation: 0,
        age: {
          max: 300,
          pubertyAge: 50,
          current: 1,
        },
        energy: {
          current: 200,
          max: 500,
        },
      };
    }
  },
  grass: (parents?: ObjectType[]) => {
    if (parents) {
      return {
        id: v4(),
        type: "grass",
        speed: 0,
        visionRadius: 1,
        generation: parents[0].generation + 1,
        age: {
          max: 8,
          pubertyAge: 6,
          current: 1,
        },
        energy: {
          current: 10,
          max: 100,
        },
      };
    } else {
      return {
        id: v4(),
        type: "grass",
        speed: 0,
        visionRadius: 1,
        generation: 0,
        age: {
          max: 8,
          pubertyAge: 6,
          current: 1,
        },
        energy: {
          current: 10,
          max: 100,
        },
      };
    }
  },
} as const;
