import { PositionType } from "@/types/baseTypes";
import { BaseAliveObject, EnvironmentType } from "./baseObjectClass";
import { BasePlantType } from "./types/baseObjectTypes";
import { RenderFunctions } from "../dataVisualizer/utils/renderParams";
import { getRandomNumber } from "@/lib/utils";
import { StepType } from "../stepHandler/types/step";

export abstract class BasePlantClass
  extends BaseAliveObject
  implements BasePlantType
{
  visionRadius!: number;
  constructor() {
    super();
  }
}
export class Grass extends BasePlantClass implements BasePlantType {
  constructor(position: PositionType, specific?: Partial<BasePlantType>) {
    super();
    this.availableSurfaces = ["land"];
    this.renderParams = RenderFunctions.grass;
    this.age = {
      current: specific?.age?.current ?? 0,
      max: specific?.age?.max ?? 5,
      pubertyAge: specific?.age?.pubertyAge ?? 5,
    };
    this.visionRadius = specific?.visionRadius ?? 1;
    this.generation = specific?.generation ?? 0;
    this.position = position;
  }
  reproduce() {
    console.log("rep");
    return Array(getRandomNumber(1, 5))
      .fill(null)
      .map(
        () =>
          new Grass({
            x: this.position.x + getRandomNumber(-1, 1),
            y: this.position.y + getRandomNumber(-1, 1),
          })
      );
  }
  do(environment: EnvironmentType) {
    return this.globalApply.bind(this);
  }
}
