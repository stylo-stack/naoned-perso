import React, { useState } from "react";
import type { ArretStop } from "naolib-wait-time-js";
import type { WaitTimeConfig } from "../../WaitTimeContext";
import { StopSearchStep } from "./SearchStopStep";
import { ChooseLineStep } from "./ChooseLineStep";
import { ChooseDirectionStep } from "./ChooseDirectionStep";

type Props = {
  onDone: (config: WaitTimeConfig) => void;
};

type Step =
  | { type: "stop" }
  | { type: "line"; stop: ArretStop }
  | { type: "direction"; stop: ArretStop; numLigne: string };

export function WaitTimeSetup({ onDone }: Props) {
  const [step, setStep] = useState<Step>({ type: "stop" });

  if (step.type === "stop") {
    return (
      <StopSearchStep onSelect={(stop) => setStep({ type: "line", stop })} />
    );
  }
  if (step.type === "line") {
    return (
      <ChooseLineStep
        stop={step.stop}
        onBack={() => setStep({ type: "stop" })}
        onSelect={(numLigne) =>
          setStep({ type: "direction", stop: step.stop, numLigne })
        }
      />
    );
  }
  return (
    <ChooseDirectionStep
      stop={step.stop}
      numLigne={step?.numLigne}
      onBack={() => setStep({ type: "line", stop: step.stop })}
      onSelect={(sens, terminusLabel, lineColor) =>
        onDone({
          codeLieu: step.stop.codeLieu,
          stopLabel: step.stop.libelle,
          numLigne: step?.numLigne,
          sens,
          terminusLabel,
          lineColor,
        })
      }
    />
  );
}
