"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCanvas from "@/features/canvas/hooks/useCanvas";
import usePerlinNoise from "@/hooks/usePerlinNoise";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const objectRendererBlock = useRef<HTMLDivElement>(null);
  const { canvasRef, render } = useCanvas();
  const { get, regenerate } = usePerlinNoise();
  const [waterLevel, setWaterLevel] = useState<number>(0.35);
  const sandLevel = waterLevel + 0.2;
  const rabbits: { x: number; y: number }[] = [];
  const landscapeScale = d3.scaleLinear(
    [0, waterLevel, waterLevel, sandLevel, 1 - sandLevel, 1],
    ["#7B99FA", "#53CDD8", "#F1F3B8", "#96EAB7", "#96EAB7"]
  );
  render(({ context }) => {
    console.log(context.canvas.width, context.canvas.height);
    for (let x = 0; x < context.canvas.width; x++) {
      for (let y = 0; y < context.canvas.height; y++) {
        const value = get(x, y);
        context.fillStyle = landscapeScale(value);
        context.fillRect(x, y, 1, 1);
      }
    }
  });
  useEffect(() => {
    if (!objectRendererBlock.current) return;

    const height = objectRendererBlock.current.clientHeight;
    const width = objectRendererBlock.current.clientWidth;
    console.log(width, height);
    const baseSectorSize = 10;
    const marginY = (height % baseSectorSize) / 2;
    const marginX = (width % baseSectorSize) / 2;
    const mapSize = [
      (width - marginX * 2) / baseSectorSize,
      (height - marginY * 2) / baseSectorSize,
    ];
    for (let x = 0; x < mapSize[0]; x++) {
      for (let y = 0; y < mapSize[1]; y++) {
        const value = get(
          marginX + x * baseSectorSize,
          marginY + y * baseSectorSize
        );
        if (x == 5 && y == 5) {
          rabbits.push({ x, y });
        }
      }
    }
    const container = d3.select(objectRendererBlock.current).append("svg");
    const map = container
      .append("g")
      .attr("transform", `translate(${marginX},${marginY})`);

    map
      .selectAll("svg")
      .data(rabbits)
      .join((enter) =>
        enter
          .append("svg")
          .attr("height", baseSectorSize)
          .attr("width", baseSectorSize)
          .attr("fill", "green")
          .attr("stroke", "green")
          .attr("viewBox", "0 0 512 512")
          .attr("x", (r) => r.x * baseSectorSize)
          .attr("y", (r) => r.y * baseSectorSize)
          .append("path")
          .attr(
            "d",
            "M18 494l36.35-330.4c6.728 107.62 4.086 231.82 35.556 295.67 11.205-84.926 15.707-168.18 10.562-249.01 15.225 71.69 35.543 141.68 39.468 217.14 7.395-55.935 12.667-111.52 31.798-169.41-.76 65.19-17.16 124.9 12.677 157.47 14.433-51.01 28.992-101.9 31.46-164.88 21.27 61.862 18.342 135.82 24.948 205.02 8.417-68.06 15.28-257.84 46.907-318.17-3.11 124.98-3.862 223.94 27.398 274.23 30.897-38.673 33.566-114.44 34.28-186.34 21.812 61.75 36.457 132.1 37.857 218.34 8.626-71.955 18.667-143.91 43.39-215.86-5.748 88.29-1.284 156.95 19.525 194.17 13.76-55.55 25.504-111.1 29.12-166.66 18.42 82.78 13 159.59 16.706 238.69z"
          )
      );

    console.log(mapSize);
  }, [objectRendererBlock]);

  return (
    <div className="h-screen w-screen p-5 grid grid-cols-3 gap-5">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 ">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="status">Active status</TabsTrigger>
          <TabsTrigger value="statistic">Statistic</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          {/* Map management */}
          <Card>
            <CardHeader>
              <CardTitle>Map management</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-muted-foreground pb-2">water level</p>
                <Slider
                  value={[waterLevel]}
                  max={0.7}
                  min={0}
                  step={0.01}
                  onValueChange={(v) => setWaterLevel(v[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={"outline"} onClick={regenerate}>
                regenerate
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="status">321</TabsContent>
        <TabsContent value="statistic">123</TabsContent>
      </Tabs>

      <div className="col-span-2">
        <Card className="size-full overflow-hidden relative">
          <div
            ref={objectRendererBlock}
            className="w-full h-full absolute top-0 left-0 z-10"
          />
          <canvas
            className="w-full h-full absolute top-0 left-0"
            ref={canvasRef}
          />
        </Card>
      </div>
    </div>
  );
}
