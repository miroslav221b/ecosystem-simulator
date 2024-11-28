import { PositionType } from "@/types/baseTypes";
import { v4 } from "uuid";
import { BaseMapTileType, SurfaceType } from "../map/types/map";
import {
  AgeSetting,
  BaseAliveObjectType,
  BaseObjectType,
  SexTypes,
} from "./types/baseObjectTypes";
import { RenderParams } from "./types/baseObject";
import { StepObjectType, StepType } from "../stepHandler/types/step";
import { createPositionKey } from "./utils/positionFn";
export type EnvironmentType = {
  surface: BaseMapTileType[];
  objects: StepObjectType[];
};
export type stateMutationFn = (step: StepType) => StepType;

export abstract class BaseObject implements BaseObjectType {
  position!: PositionType;
  renderParams!: RenderParams;
  id: string;
  availableSurfaces!: SurfaceType[];
  actions: stateMutationFn[] = [];
  constructor() {
    this.id = v4();
  }
  globalMove(from: PositionType, to: PositionType) {
    this.actions.push((s) => {
      const currentObject = s.objects[createPositionKey(from)];
      s.objects[createPositionKey(to)] = currentObject;
      delete s.objects[createPositionKey(from)];
      return s;
    });
  }
  globalDelete(target: PositionType) {
    this.actions.push((s) => {
      delete s.objects[createPositionKey(target)];
      return s;
    });
  }
  globalCreate(position: PositionType, object: StepObjectType) {
    this.actions.push((s) => {
      s.objects[createPositionKey(position)] = object;
      return s;
    });
  }
  globalApply(step: StepType): StepType {
    const newState = this.actions.reduce<StepType>(
      (accumulator, action) => action(accumulator),
      step
    );

    this.actions = [];
    return newState;
  }
}
export abstract class BaseAliveObject
  extends BaseObject
  implements BaseAliveObjectType
{
  age!: AgeSetting;
  generation!: number;
  sex: SexTypes;
  visionRadius!: number;
  constructor() {
    super();
    this.sex = Math.random() > 0.5 ? SexTypes.male : SexTypes.female;
  }
  die() {
    this.globalDelete(this.position);
  }

  grow() {
    this.age.current = this.age.current + 1;
    if (this.age.current === this.age.max) {
      this.die();
    }
  }
  abstract reproduce<T>(partner: T, position: PositionType): void;
  abstract do(environment: EnvironmentType): (step: StepType) => StepType;
}
