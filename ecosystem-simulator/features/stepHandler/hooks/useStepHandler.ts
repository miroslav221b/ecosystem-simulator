import { useMemo, useState } from "react";
import { StepType } from "../types/step";

export type StepHandlerPropsType = {
  stepCalculation: (step?: StepType) => Promise<StepType>;
};
export default function useStepHandler({
  stepCalculation,
}: StepHandlerPropsType) {
  const [steps, setSteps] = useState<StepType[]>([]);
  const [activeTime, setActiveTime] = useState<number>(0);

  const activeStep = useMemo(
    () => steps.find((step) => step.stepsPassed === activeTime),
    [activeTime]
  );
  async function generateSteps(amount: number) {
    const newSteps = await Array(amount)
      .fill(null)
      .reduce<Promise<StepType[]>>(async (accumulator) => {
        const previousSteps = (await accumulator) ?? [];
        const lastSteps = previousSteps.slice(-1);
        const previousStep = lastSteps.length === 1 ? lastSteps[0] : undefined;
        const previousStepClone =
          previousStep !== undefined
            ? Object.assign(
                Object.create(Object.getPrototypeOf(previousStep)),
                previousStep
              )
            : undefined;
        const newStep = await stepCalculation(previousStepClone);
        return [...previousSteps, newStep];
      }, Promise.resolve(steps));
    setSteps(newSteps);
    return newSteps;
  }
  function clearSteps() {
    setSteps([]);
  }
  return {
    steps,
    activeTime,
    activeStep,
    setActiveTime,
    generateSteps,
    clearSteps,
  };
}
