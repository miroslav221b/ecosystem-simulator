import { PositionType } from "@/types/baseTypes";
import { ObjectType } from "./objects";

export type StepObjectActionTypes =
  | {
      type: "move";
      target: string | PositionType;
      to: PositionType;
    }
  | {
      type: "delete";
      target: string | PositionType;
    }
  | {
      type: "create";
      target: PositionType;
      object: ObjectType;
    }
  | {
      type: "update";
      target: PositionType;
      newState: ObjectType;
    };
