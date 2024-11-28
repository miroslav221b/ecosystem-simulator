import { useState } from "react";
import { createNoise2D } from "simplex-noise";
import { v4 as uuidv4 } from "uuid";

function createComplexNoise() {
  return {
    main: createNoise2D(),
    sub: createNoise2D(),
    id: uuidv4(),
  };
}
export default function usePerlinNoise() {
  const [noise, setNoise] = useState(createComplexNoise);
  function get(x: number, y: number) {
    return (
      ((noise.main(y / 100, x / 100) + 1) * 4 +
        (noise.sub(x / 10, y / 10) + 1) / 2) /
      9
    );
  }
  function regenerate() {
    setNoise(createComplexNoise());
  }
  return { get, regenerate, id: noise.id };
}
