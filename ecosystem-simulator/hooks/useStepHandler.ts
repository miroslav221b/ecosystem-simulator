import { useState } from "react";

export default function useStepHandler() {
    const [steps,setSteps] = useState<any[]>([])
    const [activeStep,setActiveStep] = useState<number>()
    function next(){

    }
    function previous(){
        
    }
    return {
        next,
        previous,
        steps
    }
}
