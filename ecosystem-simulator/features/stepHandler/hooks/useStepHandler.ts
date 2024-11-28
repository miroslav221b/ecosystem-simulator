import { useMemo, useState } from "react";
import { StepType } from "../types/step";

export default function useStepHandler() {
  const [steps, setSteps] = useState<StepType[]>([]);
  const [activeStepId, setActiveStepId] = useState<string>();

  const activeStep = useMemo(
    () => steps.find((s) => s.id === activeStepId),
    [activeStepId]
  );
  function createFirstStepStep(calculateFunction: () => StepType) {
    const newStep = calculateFunction();
    setSteps([newStep]);
    setActiveStepId(newStep.id);
  }
  function createStep(
    calculateFunction: (previousSlide: StepType) => StepType
  ) {
    const newStep = calculateFunction(steps[steps.length - 1]);
    setSteps([...steps, newStep]);
    setActiveStepId(newStep.id);
  }
  return {
    steps,
    createStep,
    createFirstStepStep,
    activeStep,
  };
}
