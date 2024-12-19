import { BaseMapType, SurfaceType } from "@/features/map/types/map";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ObjectTypeWithLocation } from "@/features/objectBehavior/types/objects";
import { RenderFunctions } from "../utils/renderParams";
export default function DataVisualizer({
  objects,
  map,
  tileSize = 50,
  slideId,
}: {
  objects: ObjectTypeWithLocation[];
  map: BaseMapType;
  tileSize?: number;
  slideId: number;
}) {
  const visualizerRef = useRef(null);
  const getSurfaceColor: {
    [key in SurfaceType]: (height: number) => string;
  } = {
    [SurfaceType.land]: d3.scaleLinear([0, 1], ["#eaf26f", "#76b356"]),
    [SurfaceType.water]: d3.scaleLinear([0, 0.8], ["#6acff7", "#41648c"]),
    [SurfaceType.mountain]: d3.scaleLinear(
      [0, 0.8, 1],
      ["#8bbf6f", "#5a7035", "#f3f5f0"]
    ),
  } as const;
  const getRabbitColor = d3.scaleLinear([1, 3], ["#FFFFFF", "#000000"]);
  const t = d3.transition().duration(2000);
  useEffect(() => {
    if (!visualizerRef.current || !map) return;
    const container = d3.select(visualizerRef.current);
    container.selectAll("*").remove();
    // render map
    const mapContainer = container
      .append("div")
      .style("position", "absolute")
      .style("height", map.size * tileSize)
      .style("width", map.size * tileSize)
      .style("top", "0px")
      .style("left", "0px")
      .append("svg")
      .attr("height", map.size * tileSize)
      .attr("width", map.size * tileSize)
      .attr("viewBox", `0 0 ${map.size} ${map.size}`);

    mapContainer
      .selectAll("rect")
      .data(Object.values(map.tiles))
      .join("rect")
      .attr("fill", ({ surface, height }) => getSurfaceColor[surface](height))
      .attr("height", 1)
      .attr("width", 1)
      .attr("x", (t) => t.position.x - 1)
      .attr("y", (t) => t.position.y - 1);
    // render objects
    const objectsContainer = container
      .append("div")
      .attr("class", "objectsContainer")
      .style("z-index", "2");

    objectsContainer
      .selectAll("div")
      .data(objects)
      .join(
        (enter) => {
          const objectsContainer = enter
            .append("div")
            .style("position", "absolute")
            .style("top", (obj) => `${obj.position.y * tileSize - tileSize}px`)
            .style(
              "left",
              (obj) => `${obj.position.x * tileSize - tileSize}px`
            );

          return objectsContainer
            .append("svg")
            .attr("height", tileSize)
            .attr("width", tileSize)
            .attr("viewBox", (obj) => RenderFunctions[obj.object.type].viewBox)
            .append("path")
            .attr("fill", (obj) =>
              obj.object.type === "rabbit"
                ? getRabbitColor(obj.object.speed)
                : RenderFunctions[obj.object.type].color
            )
            .attr("d", (obj) => RenderFunctions[obj.object.type].path)
            .call((selection) => {
              return selection
                .transition(t)
                .attr("height", tileSize)
                .attr("width", tileSize);
            });
        },
        (update) =>
          update.call((obj) => {
            obj
              .transition(t)
              .style(
                "top",
                (obj) => `${obj.position.y * tileSize - tileSize}px`
              )
              .style(
                "left",
                (obj) => `${obj.position.x * tileSize - tileSize}px`
              );
          }),

        (exit) => exit.remove()
      );
  }, [visualizerRef, tileSize, map.id, slideId]);

  return (
    <div
      ref={visualizerRef}
      style={{
        width: map.size * tileSize,
        height: map.size * tileSize,
        position: "relative",
      }}
    />
  );
}
