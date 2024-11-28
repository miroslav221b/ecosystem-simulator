import { BaseMapType } from "@/features/map/types/map";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  BaseAnimalType,
  BasePlantType,
} from "@/features/objectsLogic/types/baseObjectTypes";
export default function DataVisualizer({
  objects,
  map,
  tileSize = 30,
  slideId,
}: {
  objects: Array<BaseAnimalType | BasePlantType>;
  map: BaseMapType;
  tileSize?: number;
  slideId: string;
}) {
  const visualizerRef = useRef(null);
  const landColorScale = d3.scaleLinear([0, 1], ["#eaf26f", "#76b356"]);
  const waterColorScale = d3.scaleLinear([0, 0.8], ["#6acff7", "#41648c"]);
  const mountainColorScale = d3.scaleLinear(
    [0, 0.8, 1],
    ["#8bbf6f", "#5a7035", "#f3f5f0"]
  );
  useEffect(() => {
    if (!visualizerRef.current || !map) return;
    const container = d3.select(visualizerRef.current);
    container.selectAll("div").remove();
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
      .attr("fill", (t) =>
        t.surface === "land"
          ? landColorScale(t.height)
          : t.surface === "water"
          ? waterColorScale(t.height)
          : t.surface === "mountain"
          ? mountainColorScale(t.height)
          : "#ffff"
      )
      .attr("height", 1)
      .attr("width", 1)
      .attr("y", (t) => t.position.y)
      .attr("x", (t) => t.position.x);
    // render objects
    const objectsContainer = container
      .append("div")
      .attr("class", "objectsContainer")
      .style("z-index", "2");

    objectsContainer
      .selectAll("div")
      .data(objects)
      .enter()
      .append("div")
      .style("position", "absolute")
      .style("top", (t) => `${t.position.y * tileSize}px`)
      .style("left", (t) => `${t.position.x * tileSize}px`)
      .append("svg")
      .attr("height", tileSize)
      .attr("width", tileSize)
      .attr("viewBox", (t) => t.renderParams.viewBox)
      .append("path")
      .attr("fill", (t) => t.renderParams.color)
      .attr("d", (t) => t.renderParams.path)
      .exit()
      .remove();
  }, [visualizerRef, slideId, tileSize]);

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
