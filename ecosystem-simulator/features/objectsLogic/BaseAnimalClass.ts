import { PositionType } from "@/types/baseTypes";
import { Grass } from "./BasePlantClass";
import {
  BaseAliveObject,
  EnvironmentType,
  stateMutationFn,
} from "./baseObjectClass";
import {
  BaseAnimalType,
  EnergySettings,
  FeedingHabitTypes,
} from "./types/baseObjectTypes";
import { calculateDistance, sortByDistanceToObj } from "./utils/positionFn";
import { RenderFunctions } from "../dataVisualizer/utils/renderParams";

export abstract class BaseAnimalClass
  extends BaseAliveObject
  implements BaseAnimalType
{
  speed!: number;
  feedingHabit!: FeedingHabitTypes;
  energy!: EnergySettings;
  constructor() {
    super();
  }
  eat(target: Grass | Rabbit) {
    target.die();
    if (target instanceof Grass) {
      this.gainEnergy(3);
    } else if (target instanceof Rabbit) {
      this.gainEnergy(7);
    }
  }
  gainEnergy(amount: number) {
    this.energy.current = this.energy.current + amount;
    if (this.energy.current > this.energy.max) {
      this.energy.current = this.energy.max;
    }
  }
  wasteEnergy(amount: number) {
    this.energy.current = this.energy.current - amount;
    if (this.energy.current === 0) {
      this.die;
    }
  }
  move(position: PositionType) {
    for (let x = 0; x < this.speed; x++) {
      if (this.position.x > position.x) {
        this.position.x = this.position.x - 1;
      } else if (this.position.x < position.x) {
        this.position.x = this.position.x + 1;
      }
      if (this.position.y > position.y) {
        this.position.y = this.position.y - 1;
      } else if (this.position.y < position.y) {
        this.position.y = this.position.y + 1;
      }
    }
    this.wasteEnergy(this.speed);
  }
  flee(fromPosition: PositionType) {
    for (let x = 0; x < this.speed; x++) {
      if (this.position.x < fromPosition.x) {
        this.position.x = this.position.x - 1;
      } else if (this.position.x > fromPosition.x) {
        this.position.x = this.position.x + 1;
      }
      if (this.position.y < fromPosition.y) {
        this.position.y = this.position.y - 1;
      } else if (this.position.y > fromPosition.y) {
        this.position.y = this.position.y + 1;
      }
    }
    this.wasteEnergy(this.speed);
  }
  getFood(environment: EnvironmentType) {
    const foodClass =
      this.feedingHabit === FeedingHabitTypes.carnivores ? Rabbit : Grass;
    const closestFood = environment.objects
      .filter((obj) => obj instanceof foodClass)
      .sort((a, b) =>
        sortByDistanceToObj(a.position, b.position, this.position)
      )[0];
    if (closestFood && closestFood instanceof foodClass) {
      if (calculateDistance(closestFood.position, this.position) === 1) {
        this.eat(closestFood);
      } else {
        this.move(closestFood.position);
      }
    } else {
    }
  }
  grow() {
    super.grow();
    this.wasteEnergy(0.5);
  }
}
export class Rabbit extends BaseAnimalClass implements BaseAnimalType {
  constructor(position: PositionType, specific?: Partial<BaseAnimalType>) {
    super();
    this.availableSurfaces = ["land"];
    this.renderParams = RenderFunctions.rabbit;
    this.feedingHabit = FeedingHabitTypes.herbivores;
    this.position = position;
    this.speed = specific?.speed ?? 1;
    this.visionRadius = specific?.visionRadius ?? 5;
    this.age = {
      current: specific?.age?.current ?? 0,
      max: specific?.age?.max ?? 100,
      pubertyAge: specific?.age?.pubertyAge ?? 3,
    };
    this.generation = specific?.generation ?? 0;
    this.energy = {
      max: specific?.energy?.max ?? 15,
      current: specific?.energy?.current ?? 10,
    };
  }
  reproduce<T>(partner: T) {
    return [];
  }
  do(environment: EnvironmentType) {
    return this.globalApply.bind(this);
  }
}
export class Fox extends BaseAnimalClass implements BaseAnimalType {
  constructor(position: PositionType, specific?: Partial<BaseAnimalType>) {
    super();
    this.availableSurfaces = ["land"];
    this.renderParams = RenderFunctions.fox;
    this.feedingHabit = FeedingHabitTypes.carnivores;
    this.position = position;
    this.speed = specific?.speed ?? 1;
    this.visionRadius = specific?.visionRadius ?? 4;
    this.age = {
      current: specific?.age?.current ?? 0,
      max: specific?.age?.max ?? 200,
      pubertyAge: specific?.age?.pubertyAge ?? 6,
    };
    this.generation = specific?.generation ?? 0;
    this.energy = {
      max: specific?.energy?.max ?? 40,
      current: specific?.energy?.current ?? 20,
    };
  }
  reproduce<T>(partner: T) {
    return [];
  }
  do(environment: EnvironmentType) {
    return this.globalApply.bind(this);
  }
}
