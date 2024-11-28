"use client";
import { Button } from "@/components/ui/button";
import DataVisualizer from "@/features/dataVisualizer/components/DataVisualazer";
import useMap from "@/features/map/hooks/useMap";
import {
  StepObjectDataType,
  StepObjectType,
  StepType,
} from "@/features/stepHandler/types/step";
import useStepHandler from "@/features/stepHandler/hooks/useStepHandler";
import { v4 } from "uuid";
import { Card } from "@/components/ui/card";
import { createPositionKey } from "@/features/objectsLogic/utils/positionFn";
import { PositionType } from "@/types/baseTypes";
import { Fox, Rabbit } from "@/features/objectsLogic/BaseAnimalClass";
import { Grass } from "@/features/objectsLogic/BasePlantClass";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const { map, regenerate, getSurfaceAround } = useMap({ defaultSize: 100 });
  const { createFirstStepStep, activeStep, createStep } = useStepHandler();
  const [scale, setScale] = useState<number>(1);
  function getObjectsAround(
    position: PositionType,
    radius: number,
    allObjects: StepObjectDataType
  ): StepObjectType[] {
    const objectsInVision: StepObjectType[] = [];
    for (let y = position.y - radius; y < position.y + radius; y++) {
      for (let x = position.x - radius; x < position.x + radius; x++) {
        const object = allObjects[createPositionKey({ x, y })];
        if (object) objectsInVision.push(object);
      }
    }
    return objectsInVision;
  }
  function onStart() {
    createFirstStepStep(() => {
      const objects: StepObjectDataType = {};
      Object.values(map.tiles)
        .filter((t) => Math.random() > 0.95 && t.surface === "land")
        .forEach((tile) => {
          const position = structuredClone(tile.position);
          const random = Math.random();
          const positionKey = createPositionKey(position);
          if (random < 0.5) objects[positionKey] = new Grass(position);
          else if (random < 0.85) objects[positionKey] = new Rabbit(position);
          else if (random < 1) objects[positionKey] = new Fox(position);
        });
      return {
        id: v4(),
        map,
        stepsPassed: 0,
        objects,
      };
    });
  }
  function nextStep() {
    createStep((prevStep) => {
      const mutedStepStep = Object.values(prevStep.objects).reduce<StepType>(
        (accumulator, currentObj) =>
          currentObj.do({
            objects: getObjectsAround(
              currentObj.position,
              currentObj.visionRadius,
              accumulator.objects
            ),
            surface: getSurfaceAround(
              currentObj.position,
              currentObj.visionRadius
            ),
          })(prevStep),
        prevStep
      );
      const newStep: StepType = {
        ...mutedStepStep,
        id: v4(),
        stepsPassed: prevStep.stepsPassed + 1,
      };
      return newStep;
    });
  }

  return (
    <div className=" h-screen w-full grid grid-cols-3">
      <div className=" flex flex-col gap-2">
        <Button onClick={regenerate}>regenerate map</Button>
        <Button onClick={onStart}>start</Button>
        <Button onClick={nextStep}>nextStep</Button>
        <div>zoom</div>
        <Slider
          min={1}
          max={20}
          step={1}
          value={[scale]}
          onValueChange={([v, ...i]) => setScale(v)}
        />
      </div>
      <Card className="overflow-scroll size-full col-span-2">
        {activeStep !== undefined && (
          <DataVisualizer
            tileSize={scale}
            objects={Object.values(activeStep.objects)}
            map={activeStep.map}
            slideId={activeStep.id}
          />
        )}
      </Card>
    </div>
  );
}
