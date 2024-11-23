"use client";
import { useEffect, useRef, useState } from "react";

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D>();
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    setContext(context);
  }, []);

  function render(
    rendererFn: ({ context }: { context: CanvasRenderingContext2D }) => void
  ) {
    if (!context) return;
    rendererFn({ context });
  }
  return { canvasRef, render };
}
