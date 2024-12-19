"use client";
import { Button } from "@/components/ui/button";
import DataVisualizer from "@/features/dataVisualizer/components/DataVisualazer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import useSimulation from "@/features/simulation/hooks/useSimulliation";
import { readPositionKey } from "@/features/objectsLogic/utils/positionFn";
import { PositionKeyType } from "@/features/map/types/map";
import { Input } from "@/components/ui/input";
export default function Home() {
  const [scale, setScale] = useState<number>(5);
  const [renderAmount, setRenderAmount] = useState(100);
  const [isStepsRendering, setIsStepsRendering] = useState<boolean>(false);
  const { steps, ...simulation } = useSimulation({
    mapSize: 150,
  });
  const activeStep = steps[simulation.activeTime];
  return (
    <div className=" h-screen w-full grid grid-cols-3 gap-5">
      <div className=" flex flex-col gap-4 p-5">
        <Card>
          <CardHeader>
            <CardTitle>Simulation</CardTitle>
            <CardDescription>total time {steps.length}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-between gap-5">
              <div>Zoom</div>
              <Slider
                min={1}
                max={50}
                step={1}
                value={[scale]}
                onValueChange={([v]) => setScale(v)}
              />
            </div>
            <div className="flex justify-between gap-5">
              <div>Time</div>
              <Slider
                min={0}
                max={steps.length - 1}
                step={1}
                value={[simulation.activeTime]}
                onValueChange={([v]) => {
                  simulation.setActiveTime(v);
                }}
              />
            </div>
            <div className="flex justify-between gap-5">
              <Input
                type="number"
                value={renderAmount}
                onChange={(e) => setRenderAmount(parseInt(e.target.value))}
              />

              <Button
                onClick={() => {
                  setIsStepsRendering(true);
                  simulation.generateSteps(renderAmount).then((slides) => {
                    setIsStepsRendering(false);
                  });
                }}
              >
                Render new slides
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            {/* <Button onClick={simulation.regenerateMap}>regenerate map</Button> */}
          </CardFooter>
        </Card>
      </div>
      <Card className="overflow-scroll size-full col-span-2 flex items-center justify-center">
        {activeStep !== undefined && (
          <DataVisualizer
            tileSize={scale}
            objects={Object.entries(activeStep.objects).map(
              ([positionKey, value]) => {
                return {
                  position: readPositionKey(positionKey as PositionKeyType),
                  object: value,
                };
              }
            )}
            map={activeStep.map}
            slideId={activeStep.stepsPassed}
          />
        )}
      </Card>
    </div>
  );
}
